/*
Copyright (C) 2023 Intel Corporation
SPDX-License-Identifier: MIT
*/
import { ipv4Unwrap, pcapClose, pcapOpen, pcapRead, TimestampedBuffer } from "./pcap";
import { join, split } from "./tcf/tcfutils";
import assert = require("assert");

export interface Sockety {
    on(event: string, handler: (arg: any) => void): void;
    write(b: Buffer): unknown;
    connect(port: number, host: string): void;
    end(callback?: () => void): this;
    setNoDelay(d: boolean): void;
    setKeepAlive(keep: boolean): void;
}

export interface MockFlags {
    /**
     * The mock socket is not strict about ordering. Most replies are delayed until
     * a command actually comes in. This is designed to accomodate timing variations in how
     * the user / code may invoke commands.
     *
     * If this flag is `true` it consumes events and replies eagerly. This may break
     * most scenarios but may also be preferable in other situations (eg. specific tests).
     */
    consumeEventsRepliesEagerly?: boolean;
}

const MOCK_SOCKET_READ_DELAY = 50; //milliseconds
//TODO: The mock socket should use timestamps and try to simulate the delay between messages too!
export class MockTCFSocket implements Sockety {
    connected: boolean = false;
    connectHandler: (arg: any) => void = () => { };
    dataHandler: (arg: any) => void = () => { };

    fd: number;
    flags: MockFlags;

    sentCache: TimestampedBuffer[] = [];
    receiveCache: TimestampedBuffer[] = [];

    //an "active" token is a token used by a command that has not yet received a reply
    activeTokens: Set<string> = new Set();
    tokenMapping: Map<string, Buffer> = new Map(); //new-old token mapping; using a string key for easy key comparison
    //an active service is a service which sent a command already. Once a service is seen to have sent something the socket will return events too.
    activeServices: Set<string> = new Set();

    timer: NodeJS.Timeout | null = null;

    constructor(path: string, flags: MockFlags) {
        this.fd = pcapOpen(path);
        this.activeServices.add("Locator"); //the Locator service is always active since it has the heartbeat event. Possibly more services will be required here...
        this.flags = flags;
    }

    //@returns the new-old token pair to use (for remapping). If old token is undefined, not equal.
    protected equalsSent(sent: Buffer, disk: Buffer): [Buffer, Buffer | undefined] {
        const [C1, token1, service1, command1, ...args1] = split(sent);
        const b = sent.equals(disk);
        if (b) {
            return [token1, token1];
        } else {
            //is the data identical
            const [C2, token2, service2, command2, ...args2] = split(disk);
            if (C1.equals(C2) && service1.equals(service2) && command1.equals(command2)) {
                if (args1.length !== args2.length) { //TODO: +/- 1 perhaps?!
                    return [token1, undefined];
                }
                for (let i = 0; i < args1.length; i++) {
                    if (!args1[i].equals(args2[i])) {
                        return [token1, undefined];
                    }
                }

                //all match, *except* the token, remap it
                return [token2, token1];
            }

            return [token1, undefined];
        }
    }

    //@return undefined for no action or new-old token pair
    private removeSent(b: Buffer): [Buffer, Buffer] | undefined {
        for (let i = 0; i < this.sentCache.length; i++) {
            const [newToken, oldToken] = this.equalsSent(b, this.sentCache[i].data);
            if (oldToken) {
                this.sentCache.splice(i, 1); //remove element
                return [newToken, oldToken];
            }
        }

        return undefined;
    }

    private removeReplyOrEvent(): Buffer | null {
        for (let i = 0; i < this.receiveCache.length; i++) {
            const b = this.receiveCache[i].data;
            const consume = this.consumeReplyOrEvent(b);
            if (consume) {
                this.receiveCache.splice(i, 1);
                return consume;
            }
        }

        //if we got here then we may still have (broken) replies, just push one
        if (this.flags.consumeEventsRepliesEagerly && this.receiveCache.length > 0) {
            const b = this.receiveCache[0].data;
            this.receiveCache.splice(0, 1); //remove 1st element
            return b;
        }

        return null;
    }

    private saveCommand(unixTimestampSec: number, data: Buffer) {
        this.sentCache.push({ unixTimestampSec, data });
    }

    private saveReply(unixTimestampSec: number, data: Buffer) {
        this.receiveCache.push({ unixTimestampSec, data });
    }

    private activateFor(data: Buffer): void {
        const [C, token, service, command, ...args] = split(data);
        switch (C.toString()) {
            case "E":
                //nothing, this was a sent event...
                this.addActiveService(token.toString()); //here the token is actually... the Service name! ugly.
                break;
            case "C":
                this.addActiveToken(token.toString());
                this.addActiveService(service.toString());
                break;
            default:
                //TODO: throw error?
                console.log(`Cannot activate for unknown TCF message. Ignoring message type ${C.toString()}`);
                break;
        }
    }

    private addActiveToken(token: string): void {
        this.activeTokens.add(token);
    }

    private addActiveService(service: string): void {
        this.activeServices.add(service);
    }

    private isCommand(data: Buffer): boolean {
        switch (data[0]) {
            case "C".charCodeAt(0):
                return true;
            default:
                return false;
        }
    }

    //consume reply or event if it has an active token/service
    private consumeReplyOrEvent(data: Buffer): Buffer | undefined {
        switch (data[0]) {
            case "E".charCodeAt(0):
                const [E, evtService, event, ...rawEventDatas] = split(data);
                if (this.activeServices.has(evtService.toString())) {
                    return data;
                } else {
                    return undefined;
                }
            case "R".charCodeAt(0):
            case "P".charCodeAt(0):
                const [R, resultToken, ...resultRest] = split(data);

                const index = this.activeTokens.has(resultToken.toString());
                if (index) {
                    this.activeTokens.delete(resultToken.toString()); //removes token!
                    const oldToken = this.tokenMapping.get(resultToken.toString());
                    if (oldToken !== undefined && !oldToken.equals(resultToken)) {
                        //replacing token
                        console.log(`Replacing response token from ${resultToken.toString()} to ${oldToken.toString()}`);
                        return join([R, oldToken, ...resultRest]);
                    } else {
                        return data;
                    }
                } else {
                    return undefined;
                }
                break;
            default:
                return undefined;
        }
    }

    on(what: string, handler: (arg: any) => void): void {
        switch (what) {
            case "error":
                //ignore
                return;
            case "connect":
                this.connectHandler = handler;
                break;
            case "data":
                this.dataHandler = handler;
                break;
            default:
                throw new Error(`Method ${what} not implemented.`);
        }
    }

    write(b: Buffer): void {
        if (!this.connected) {
            throw new Error("Not connected");
        }

        let rs = this.removeSent(b);
        if (rs) {
            //TODO: this should impact internal clock somehow

            //found Buffer in sent cache
            //activate replies and events corresponding to this command
            const [newToken, oldToken] = rs;
            if (newToken.equals(oldToken)) {
                this.activateFor(b);
            } else {
                const [C, token, ...args2] = split(b);

                assert(C.toString() === "C");
                assert(token.equals(oldToken));

                this.activateFor(join([C, newToken, ...args2]));
                console.log(`Adding token mapping from ${oldToken.toString()} to ${newToken.toString()}`);
                this.tokenMapping.set(newToken.toString(), oldToken);
            }
        } else {
            //not found, must read
            if (!this.fd) {
                //closed file?
                return;
            }

            while (true) {
                let packet;
                try {
                    packet = pcapRead(this.fd);
                } catch (e) {
                    //error reading packet, file probably ended
                    console.log(`Error mock-writing (matching data not found in file!): ${e}`);
                    console.log(new Error().stack);
                    //close to avoid further reading into this file
                    //NOTE: we should *not* terminate the timer since there may still be cache packets to return!
                    //NOTE2: while this is most likely an error, this may allow a timeout
                    this.closeFile();
                    break;
                }

                const ipData = ipv4Unwrap(packet.data);

                const [newToken, oldToken] = this.equalsSent(b, ipData.data);
                if (oldToken) {
                    if (newToken.equals(oldToken)) {
                        //perfect match
                        //found it
                        this.activateFor(b);
                    } else {
                        //found match with different key... just simulate a token remapping by activating the read data
                        console.log(`Remapping token ${oldToken.toString()} to ${newToken.toString()}`);
                        //found it
                        this.activateFor(ipData.data);
                        this.tokenMapping.set(newToken.toString(), oldToken);
                    }
                    break;
                } else {
                    if (this.isCommand(ipData.data)) {
                        this.saveCommand(packet.unixTimestampSec, ipData.data);
                    } else {
                        //must be event / reply
                        this.saveReply(packet.unixTimestampSec, ipData.data);
                    }
                }
            }
        }
    }

    connect(port: number, host: string): void {
        if (this.connected) {
            //already connected
            return;
        }

        this.connected = true;
        this.connectHandler(null);

        //simulate read
        this.timer = setInterval(() => {
            const b = this.removeReplyOrEvent();
            if (b !== null) {
                //found something in cache
                this.dataHandler(b);
            } else {
                if (!this.fd) {
                    //nothing to read from
                    return;
                }
                while (true) {
                    let packet;
                    try {
                        packet = pcapRead(this.fd);
                    } catch (e) {
                        //error reading packet, file probably ended
                        console.log(`Error reading packet from file: ${e}`);
                        //close to avoid further reading into this file
                        //NOTE: we should *not* terminate the timer since there may still be cache packets to return!
                        this.closeFile();
                        break;
                    }
                    const ipData = ipv4Unwrap(packet.data);

                    if (ipData.data.indexOf(Uint8Array.from([3, 1])) === -1) {
                        //bad serialization, append end of packet bytes
                        ipData.data = Buffer.concat([ipData.data, Buffer.from(Uint8Array.from([3, 1]))]);
                    }

                    if (this.isCommand(ipData.data)) {
                        this.saveCommand(packet.unixTimestampSec, ipData.data);
                    } else {
                        const consume = this.consumeReplyOrEvent(ipData.data);
                        if (consume) {
                            this.dataHandler(consume);
                            break;
                        } else {
                            this.saveReply(packet.unixTimestampSec, ipData.data);
                        }
                    }
                }
            }
        }, MOCK_SOCKET_READ_DELAY);
    }

    private clearTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    private closeFile() {
        if (this.fd) {
            pcapClose(this.fd);
            this.fd = 0;
        }
    }

    end(callback?: (() => void) | undefined): this {
        this.connected = false;
        this.clearTimer();
        this.closeFile();
        if (callback) {
            callback();
        }
        return this;
    }

    setNoDelay(d: boolean): void {
        //nothing
    }

    setKeepAlive(keep: boolean): void {
        //nothing
    }

}