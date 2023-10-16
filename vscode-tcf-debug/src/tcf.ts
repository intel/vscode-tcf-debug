/*
Copyright (C) 2022, 2023 Intel Corporation
SPDX-License-Identifier: MIT
*/
import { split, splitBuffer, SimpleCommand, SimpleEvent, PromiseSuccess, PromiseError, TimeoutError } from './tcf/tcfutils';
import { TCFContextData, SuspendRunControlCommand, ResumeRunControlCommand, GetContextRunControlCommand, Modes, asNullableTCFContextData } from './tcf/runcontrol';
import { AddBreakpointsCommand, BreakpointData, RemoveBreakpointsCommand, SetBreakpointsCommand } from './tcf/breakpoints';
import { HelloLocatorEvent } from './tcf/locator';
import { QueryCommand } from './tcf/contextquery';

import * as net from "net";
import { TCFError, TCFErrorCodes } from './tcf/error';
import { ipv4Header, pcapAppend, pcapClose } from './pcap';
import { MockTCFSocket, Sockety } from './mocksocket';

export interface TCFLogger {
    //TCF message sent to server
    sent(message: string): void;
    //TCF response received from server
    received(message: string): void;

    log(message: string): void;
    error(message: string): void;
}

//XXX: This could also be a lifecycle handler with preSend method
export interface SimpleCommandStamper {
    setTokenID(c: SimpleCommand<any>): void;
}

/**
 * Incrementally sets token ID per command. Each TCF service gets a separate counter starting with 0.
 */
export class DefaultCommandStamper implements SimpleCommandStamper {
    counters: Map<String, number> = new Map();

    setTokenID(command: SimpleCommand<any>): void {
        const service = command.service();
        let id = this.counters.get(service);
        if (id === undefined) {
            id = 0;
        } else {
            id++;
        }
        this.counters.set(service, id);

        command.setTokenID(id);
    }
}

type ResponseParser = (response: Buffer[], success: PromiseSuccess<any>, error: PromiseError<any>) => void;
type PromiseResult = { success: PromiseSuccess<any>, error: PromiseError<any>, parseResponse: ResponseParser };

const DEFAULT_COMMAND_TIMEOUT_MS = 10 * 1000; //10 seconds

const PCAP_LOCALHOST = [127, 0, 0, 1];
const PCAP_OTHER_HOST = [127, 0, 0, 2];
export abstract class AbstractTCFClient {
    console: TCFLogger;
    contextInfo: { [key: string]: TCFContextData } = {};
    pcapFile: number | null = null;
    playbackPath: string | null = null;
    tokenIdGenerator: SimpleCommandStamper;
    commandTimeout: number = DEFAULT_COMMAND_TIMEOUT_MS;

    constructor(logger: TCFLogger, tokenIdGenerator: SimpleCommandStamper) {
        this.console = logger;
        this.tokenIdGenerator = tokenIdGenerator;
    }

    /**
     * Sets the TCF command timeout.
     * 
     * @param ms timeout in milliseconds
     */
    setCommandTimeout(ms: number) {
        this.commandTimeout = ms;
    }

    /**
     * Records all TCF messages to a pcap file
     * @param fd
     */
    setPcapFile(fd: number) {
        this.pcapFile = fd;
    }

    playback(path: string) {
        this.playbackPath = path;
    }

    protected abstract onEvent(service: string, event: string, datas: Buffer[]): void;

    async removeBreakpoints(ids: string[]) {
        if (ids.length === 0) {
            return; //noop
        }
        await this.sendCommand(new RemoveBreakpointsCommand(ids));
    }

    async addBreakpoints(path: string, clientLines: number[], ids: string[]) {
        if (clientLines.length === 0) {
            return; //noop
        }
        const breakpoints = this.createBreakpoints(path, clientLines, ids);
        return Promise.all(breakpoints.map(breakpoint => this.sendCommand(new AddBreakpointsCommand(breakpoint))));
    }

    createBreakpoints(path: string, clientLines: number[], ids: string[]): BreakpointData[] {
        if (ids.length !== clientLines.length) {
            throw new Error("Breakpoint lines and ids must have same length");
        }
        const breakpoints = clientLines.map((line, i) => {
            /* eslint-disable @typescript-eslint/naming-convention */
            return {
                ID: ids[i],
                Enabled: true,
                File: path,
                Line: line
            } as BreakpointData;
            /* eslint-enable */
        });
        return breakpoints;
    }

    async setBreakpoints(path: string, clientLines: number[], ids: string[]) {
        //allowing empty list of breakpoints since it may clear they breakpoints
        const breakpoints = this.createBreakpoints(path, clientLines, ids);
        await this.setBreakpointsList(breakpoints);
    }

    async setBreakpointsList(breakpoints: BreakpointData[]) {
        //allowing empty list of breakpoints since it may clear they breakpoints
        await this.sendCommand(new SetBreakpointsCommand(breakpoints));
    }

    async pause(targetContext?: string) {
        const errors = [];
        for (const context of this.getSuspendableContexts()) {
            if (targetContext && context !== targetContext) {
                continue;
            }

            try {
                await this.sendCommand(new SuspendRunControlCommand(context));
            } catch (e) {
                if (e instanceof SyntaxError) {
                    errors.push(e);
                } else {
                    const error = e as TCFError;

                    switch (error?.Code) {
                        //'{"Code":10,"Time":1671108147403,"Format":"Already stopped"}'
                        case TCFErrorCodes.ALREADY_STOPPED:
                            //this is fine, can't suspend something already stopped
                            break;
                        default:
                            errors.push(error);
                            break;
                    }
                }
            }
        }

        if (errors.length > 0) {
            throw errors;
        }
    }

    private getSuspendableContexts(): string[] {
        return Object.keys(this.contextInfo)
            .filter(context => {
                const parentID = this.contextInfo[context]?.ParentID;
                if (parentID && this.contextInfo[parentID]?.IsContainer && this.contextInfo[parentID]?.CanSuspend
                    && this.contextInfo[parentID]?.HasState) {
                    //this context has a parent, which is a container and suspendable. So, let's only suspend the parent.
                    return false; //ignore
                }

                if (this.contextInfo[context]?.CanSuspend && this.contextInfo[context]?.HasState) {
                    return true; //OK, it's suspendable
                } else {
                    return false; // not suspendable
                }
            });
    }

    /**
     *
     * @param contextID if undefined, resume everything. Otherwise resume the given context 
     * until control reaches instruction that belongs to a different line of source code
     */
    async next(contextID: string | undefined) {
        await this.resume(contextID, Modes.nextLine);
    }

    /**
     *
     * @param contextID resumes execution of given context until control reaches instruction that belongs 
     * to a different line of source code. If a function is called, stop at first line of 
     * the function code. Error is returned if line number information not available.
     */
    async stepIn(contextID: string | undefined) {
        await this.resume(contextID, Modes.stepIn);
    }

    /**
     *
     * @param contextID  resume execution of given context until control returns from current function
     */
    async stepOut(contextID: string | undefined) {
        await this.resume(contextID, Modes.stepOut);
    }

    /**
     *
     * @param contextID if undefined, resume everything. Otherwise resume only this specific context
     */
    async continue(contextID: string | undefined,) {
        await this.resume(contextID, Modes.normalExecution);
    }

    private async resume(contextID: string | undefined, mode: Modes) {
        //TODO: resume only what was actually suspended
        const errors = [];
        for (const context of this.getSuspendableContexts()) {
            if (contextID && context !== contextID) {
                continue; //we have to continue a specific context, and it's not this one
            }
            try {
                await this.sendCommand(new ResumeRunControlCommand(context, mode));
            } catch (e) {
                if (e instanceof SyntaxError) {
                    errors.push(e);
                } else {
                    const error = e as TCFError;

                    switch (error?.Code) {
                        //'{"Code":12,"Time":1671105409824,"Format":"Already running"}'
                        case TCFErrorCodes.ALREADY_RUNNING:
                            //this is acceptable, there is nothing to resume since it's running
                            break;
                        default:
                            errors.push(error);
                            break;
                    }
                }
            }
        }

        if (errors.length > 0) {
            throw errors;
        }
    }

    socket: Sockety | null = null;//= new net.Socket();

    //each key has a FIFO queue to allow duplicate keys (although not recommended...)
    //NOTE: this is also used for waiting on events!
    asyncSends: { [key: string]: PromiseResult[] } = {};

    eventKey(service: string, event: string): string {
        return `event/${service}/${event}`;
    }

    private addAsync(key: string, p: PromiseResult): void {
        if (this.asyncSends[key]) {
            this.console.error(`Command with token ${key} already exists and waiting reply. Please use a more unique token value`);
        } else {
            this.asyncSends[key] = [];
        }
        this.asyncSends[key].push(p);
    }

    private deleteAsync(key: string): PromiseResult | undefined {
        const r = this.asyncSends[key];
        if (!r) {
            return undefined; //nothing to do
        }
        const first = r.shift();
        if (r.length === 0) {
            delete this.asyncSends[key];
        }

        return first;
    }

    waitEvent(service: string, event: string): Promise<Buffer[]> {
        var p = new Promise((success, error) => {
            this.addAsync(this.eventKey(service, event), { success, error, parseResponse: (buffers: Buffer[], success, error) => { success(buffers); } });
        });

        const self = this;
        let timer: NodeJS.Timeout;

        //TODO: add helper method for timedout promise with a cleanup
        return (Promise.race([
            p,
            new Promise((s, err) => {
                function cleanUp() {
                    self.console.error(`Wait on event timeout ${service} ${event}`);

                    self.deleteAsync(self.eventKey(service, event));
                    err(new TimeoutError("timeout"));
                }

                timer = setTimeout(cleanUp, this.commandTimeout);
            }) as Promise<Buffer[]>
        ]) as Promise<Buffer[]>).finally(() => clearTimeout(timer));
    }

    sendCommand<T>(c: SimpleCommand<T>): Promise<T> {
        this.tokenIdGenerator.setTokenID(c);

        var promiseconnectSuccess = new Promise((success, error) => {
            this.addAsync(c.token(), { success, error, parseResponse: c.result.bind(c) });
        });

        this.send(c);

        const self = this;
        let timer: NodeJS.Timeout;

        return (Promise.race([
            promiseconnectSuccess,
            new Promise((s, err) => {
                function cleanUp() {
                    self.console.error("Command timeout " + c.token());

                    self.deleteAsync(c.token());
                    err(new TimeoutError(`timeout for ${c.token()}`));
                }

                timer = setTimeout(cleanUp, this.commandTimeout);
            }) as Promise<T>
        ]) as Promise<T>).finally(() => clearTimeout(timer));
    }

    private send(c: SimpleCommand<any> | SimpleEvent) {
        const rawHttpRequest = //'GET / HTTP/1.1\r\nHost: localhost\r\n\r\n' +
            c.toBuffer();//.toString();

        this.console.sent(`➡️ Sending ${rawHttpRequest.toString()}`);

        if (this.pcapFile !== null) {
            pcapAppend(this.pcapFile, Buffer.concat([ipv4Header(rawHttpRequest, PCAP_LOCALHOST, PCAP_OTHER_HOST), rawHttpRequest]));
        }
        if (this.socket === null) {
            throw new Error("No socket");
        }
        this.socket.write(rawHttpRequest);
    }

    async connect(host: string, port: number) {
        await this.rawConnect(host, port);
        await this.handshake();
    }

    async handshake() {
        const hello = new HelloLocatorEvent();
        this.send(hello);
        await this.waitEvent(hello.service(), hello.event()); //using the hello methods to avoid hardcoding the service/event names

        const contexts = await this.sendCommand(new QueryCommand("*"));
        // this.send(new GetChildrenRunControlCommand(null)); //much better than a QueryCommand("*")?

        for (const context of contexts) {
            await this.sendCommand(new GetContextRunControlCommand(context));
        }
    }

    protected onSocketError(err: any) {
        this.console.error(`Connection error ${err}`);
    }

    rawConnect(host: string, port: number): Promise<any> {
        const socket = this.playbackPath ? new MockTCFSocket(this.playbackPath) : new net.Socket();
        this.socket = socket;

        let connectSuccess: ((v: any) => void);
        let connectError: ((v: any) => void);
        var promiseconnectSuccess = new Promise((success, error) => {
            connectSuccess = success; connectError = error;
        });

        socket.setKeepAlive(true);
        socket.setNoDelay(true);
        //XXX: by default a socket will have no timeout. Considering we have a TCF command (configurable) timeout should the socket have a timeout too? Seems pointless at the moment but worth considering later on.

        socket.on('connect', () => {
            this.console.log(`Connected!`);
            connectSuccess("connected");
        });
        socket.on('error', (err) => {
            connectError(err); //TODO: this call only makes sense if the initial connection fail, not on a later disconnect
            //TODO: reconnect?
            this.onSocketError(err);
        });

        let prevData = Buffer.from([]);
        socket.on('data', data => {
            data = Buffer.concat([prevData, data]);

            const firstZero = data.indexOf(0);
            switch (firstZero) {
                case -1:
                    //partial packet or empty data?
                    prevData = data;
                    return;
                case 1:
                    //what we want!
                    break;
                default:
                    //firstZero !== 1
                    this.console.log("Bad packed: first zero at index " + firstZero + " " + data);
                    prevData = data;
                    return;
            }
            // this.console.log("DATA:");
            // this.console.log(data.toString());
            while (true) {
                const END_OF_PACKET_MARKET = Uint8Array.from([3, 1]);
                const eom = data.indexOf(END_OF_PACKET_MARKET);
                if (eom === -1) {
                    //this buffer has no EOM. Either we read it all or we stil need to receive more data
                    prevData = data;
                    return;
                }
                prevData = data.subarray(eom + 2);
                data = data.subarray(0, eom);

                if (this.pcapFile !== null) {
                    pcapAppend(this.pcapFile, Buffer.concat([ipv4Header(data, PCAP_OTHER_HOST, PCAP_LOCALHOST), data, Buffer.from(END_OF_PACKET_MARKET)]));
                }

                //this.console.log("DATA:");
                //this.console.log(data.toString());
                //this.console.log(data.toJSON().toString());

                switch (data[0]) {
                    case "C".charCodeAt(0):
                        //could be a command
                        const buffers: Buffer[] = splitBuffer(data, 4);
                        const [_, token, service, command, arg] = buffers;

                        this.console.received(`⬅️ Received ${token.toString()} ${service.toString()} ${command.toString()}`);
                        break;
                    case "E".charCodeAt(0):
                        //could be an event 
                        const [E, evtService, event, ...rawEventDatas] = split(data, Buffer.from([0]));
                        //this.console.log("Parsing JSON: ");
                        //this.console.log(rawEventData.toString());
                        this.console.received(`⬅️ Received ${evtService.toString()} ${event.toString()} ${rawEventDatas[0]}`);

                        const z = this.deleteAsync(this.eventKey(evtService.toString(), event.toString()));

                        if (z) {
                            z.parseResponse(rawEventDatas, z.success, z.error);
                        } else {
                            //Note that onEvent will not get all events, only those that were not explicitly waited on.
                            this.onEvent(evtService.toString(), event.toString(), rawEventDatas);
                        }

                        break;
                    case "F".charCodeAt(0):
                        //could be flow control
                        //ignore 
                        break;
                    case "N".charCodeAt(0):
                        break;
                    case "R".charCodeAt(0):
                    case "P".charCodeAt(0):
                        //could be a result
                        const [R, resultToken, ...resultRest] = split(data, Buffer.from([0]));
                        const resultTokenStr = resultToken.toString();

                        if (R.toString() === "R") {
                            const z = this.deleteAsync(resultTokenStr);

                            if (z) {
                                this.console.received(`⬅️ Parsing async result ${resultTokenStr}`);
                                z.parseResponse(resultRest, z.success, z.error);
                            }
                        }

                        this.console.received(`⬅️ Received Result ${resultTokenStr} ${JSON.stringify(resultRest.map(x => x.toString()))}`);
                        if (resultToken.toString().match("RunControl/[0-9]*/getContext/")) {
                            const resultData = asNullableTCFContextData(JSON.parse(resultRest[1].toString()));
                            if (resultData !== null) {
                                this.contextInfo[resultData.ID] = resultData;
                            }
                        }
                        break;
                    default:
                        throw new Error("Got unexpected data" + data[0]);
                }


                data = prevData;
            }

            // socket.destroy();
        });

        socket.connect(port, host);

        return promiseconnectSuccess;
    }

    disconnect() {
        if (this.socket) {
            this.socket.end();
        }
        if (this.pcapFile !== null) {
            pcapClose(this.pcapFile);
            this.pcapFile = null;
        }
    }

}
