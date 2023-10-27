/*
Copyright (C) 2022, 2023 Intel Corporation
SPDX-License-Identifier: MIT
*/
//
//NOTE: Stuck tests may be investigated with `wtfnode`. See https://www.npmjs.com/package/wtfnode
// You'll need the package '@types/wtfnode' and 'wtfnode'
// It's important afterwards for wtfnode to be imported first (to initialise properly):
//
//import * as wtf from 'wtfnode';
//
//NOTE2: Mocha can be instructed to exit even if it has things running with the --exit flag:
// eg. npx mocha --exit ./out/test/unitTest.js
// This is a bad workaround since it doesn't fix the underlying issue (test cleanup).
//
/* eslint no-console: "off" */

import {
    InstanceStatusData,
    SimpleCommandStamper, TCFClient, TCFLogger,
    ContextSuspendedData,
    SimpleCommand,
    DebugCommandStamper
} from 'vscode-tcf-debug/out/tcf-all';
import { TCFDebugSession, } from 'vscode-tcf-debug/out/debugProvider';
import { DebugProtocol } from '@vscode/debugprotocol';

export function sleep(time: number) {
    return new Promise((success, error) => {
        setTimeout(success, time);
    });
}

export const logger = new class implements TCFLogger {
    received(message: string): void {
        this.log(message);
    }
    sent(message: string): void {
        this.error(message);
    }
    log(message: string): void {
        console.log(message);
    }
    error(message: string): void {
        console.log(message);
    }
}();
export const nologger = new class implements TCFLogger {
    received(message: string): void {
        this.log(message);
    }
    sent(message: string): void {
        this.error(message);
    }
    log(message: string): void {
        //nothing
    }
    error(message: string): void {
        //nothing
    }
}();

export class TestTCFClient extends TCFClient {
    suspended = new Set<string>();

    constructor(log: boolean = true) {
        super(log ? logger : nologger, new DebugCommandStamper());
    }

    protected onBreakpoint(breakpointID: string, status: InstanceStatusData[]): void {
        //nothing
    }

    protected onBreakpointRemoved(breakpointIDs: string[]): void {
        //nothing
    }

    protected onBreakpointAdded(breakpointIDs: string[]): void {
        //nothing
    }

    protected onBreakpointChanged(breakpointIDs: string[]): void {
        //nothing
    }

    protected onRunControlContextSuspended(info: ContextSuspendedData) {
        this.suspended.add(info.id);
    }

    async waitOnSuspended(name: string) {
        while (true) {
            //wait on suspended
            if (this.suspended.has(name)) {
                this.suspended.clear();
                break;
            }
            await sleep(1000);
        }
    }
}

export class TinyDAP {
    seq = 1;
    session: TCFDebugSession;

    requests: Map<number, { promise: any, success: ((v: any) => void), error: ((v: any) => void) }> = new Map();
    events: Map<string, { promise: any, success: ((v: any) => void), error: ((v: any) => void) }> = new Map();

    constructor(s: TCFDebugSession) {
        this.session = s;

        this.session.onDidSendMessage(e => {
            console.log(e);
            const respSeq = (e as any)['request_seq'];
            const z = this.requests.get(respSeq);
            if (z) {
                const success = (e as any)['success'];
                if (success === false) {// could also be undefined
                    z.error(e);
                } else {
                    z.success(e);
                }
            } else if ('event' in e) {
                const evt = (e as DebugProtocol.Event).event;
                // Events are a bad match for promises since the same event may arrive multiple times while a
                // promise only succeeds once.
                // But, during tests an event usually arrives only once so it's decent enough to use promises.
                // So, the logic here is that:
                // * if an event arrives and it doesn't have any listners (aka promise) for it, we just create a promise for it
                //   /and thus keep the value/. This means that that first call will get the /stale/ value. But in practice
                //   this is good since we only care about the initializedEvent or somesuch.
                //
                // * if an event arrives and it has a corresponding promise, we succeed the promise and
                //   then clear the hashmap. Which means another forEvent call is needed so another promise is created
                //   for future events.
                //
                const hadPromise: boolean = this.events.has(evt);
                this.getOrAddEvent(evt).success(e);
                if (hadPromise) {
                    console.log(`Removing event listener for ${evt}`);
                    this.events.delete(evt); // a promise is not a listener, so once it has a value, there's no point in keeping it. new values will need another promise, ie another forEvent call
                } else {
                    //we keep the resolved promise in case somebody else needs it soon (see the explanation above why a stale value is good enough)
                }
            } else {
                console.log("Unhandled DAP message " + e);
                console.log(JSON.stringify(e));
            }
        });

    }

    private addReq(k: number) {
        let success: ((v: any) => void) = (v) => { };
        let error: ((v: any) => void) = (v) => { };
        let promise = new Promise((s, e) => {
            success = s;
            error = e;
        });
        const v = { promise, success, error };
        this.requests.set(k, v);
        return v;
    }

    private addEvent(e: string) {
        let success: ((v: any) => void) = (v) => { };
        let error: ((v: any) => void) = (v) => { };
        let promise = new Promise((s, e) => {
            success = s;
            error = e;
        });
        const v = { promise, success, error };
        this.events.set(e, v);
        return v;
    }

    private getOrAddEvent(e: string) {
        const w = this.events.get(e);
        if (w !== undefined) {
            return w;
        }

        return this.addEvent(e);
    }

    forEvent(e: string): Promise<any> {
        return this.getOrAddEvent(e).promise;
    }

    send(m: DebugProtocol.ProtocolMessage): Promise<any> {
        this.seq++;
        if (m.seq) {
            console.log(`Message already has seq ${m.seq} but generated new seq ${this.seq}`);
        }
        m.seq = this.seq;
        const r = this.addReq(this.seq);
        this.session.handleMessage(m);
        return r.promise;
    }

    async threads() {
        console.log("Waiting on threads");
        const threads = await this.send({
            command: 'threads',
            type: 'request',
        } as DebugProtocol.ThreadsRequest);
        console.log(JSON.stringify(threads));
        return threads;
    }

    async onStopped() {
        console.log("awaiting on stoppedPromise");
        const stoppedData = await this.forEvent('stopped');
        const threadId = (stoppedData as DebugProtocol.StoppedEvent).body.threadId;
        console.log(JSON.stringify(stoppedData));
        return threadId;
    }

    async configurationDone() {
        console.log("awaiting on configurationDone");
        await this.send({
            command: 'configurationDone',
            type: 'request',
        } as DebugProtocol.ConfigurationDoneRequest);
    }
}
