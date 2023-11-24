/*
Copyright (C) 2023 Intel Corporation
SPDX-License-Identifier: MIT
*/
import { LoggingDebugSession } from "@vscode/debugadapter";
import { TCFContextDataStackTrace } from "./tcf/stacktrace";
import { ClientVariable } from "./tcf-all";
import { AsyncDebugSession } from "./asyncDebugSession";

// According to https://microsoft.github.io/debug-adapter-protocol/overview#lifetime-of-objects-references
// the object reference is in the (0, 2^21) open interval.
//
// NOTE: `0` is not an accepted value!
//
// So we can basically assume a signed 32 bit number.
//
// Out reference value encodes the kind of reference too:
//
// - bit 31: the sign bit (technically JS does not need it, but VSCode maxes at 2^31-1 anyhow)
// - bit 30 and 29: object reference type. see register scope mask, local scope mask and the struct field mask
// - rest of the bits are the frame Id
//
// 31 30 29 28 27 26 25 24 23 22 21 20 19 18 17 16 15 14 13 12 11 10 9 8 7 6 5 4 3 2 1 0
// +- R  L          ... frame Id ...
//
const REGISTER_SCOPE_MASK = 1 << 30;
const LOCAL_SCOPE_MASK = 1 << 29;
const STRUCT_FIELD_MASK = REGISTER_SCOPE_MASK | LOCAL_SCOPE_MASK; //we don't need to use a separate bit
const FRAME_ID_MASK = 0x1FFFFFFF; //mask for 29 bits

type FrameMarker = { readonly marker: unique symbol }; //a intersection type marker
type FrameNumber = number; // & FrameMarker; //force a nominal type

type ReferenceMarker = { readonly marker: unique symbol };
export type ReferenceNumber = number; // & ReferenceMarker; //force a nominal type

class ThreadInfo<T> {
    frameInfo: Map<FrameNumber, TCFContextDataStackTrace> = new Map();
    subvars: Map<FrameNumber, T[]> = new Map();

    getRegisterScopeVariableReference(frameId: FrameNumber): ReferenceNumber | undefined {
        return REGISTER_SCOPE_MASK + frameId as ReferenceNumber;
    }

    getLocalScopeVariableReference(frameId: FrameNumber): ReferenceNumber | undefined {
        return LOCAL_SCOPE_MASK + frameId as ReferenceNumber;
    }

    getStackFrameDetails(reference: ReferenceNumber): [string, string] | undefined {
        const frameId = ThreadInfo.getFrameId(reference);
        const data = this.frameInfo.get(frameId);
        if (!data) {
            return undefined;
        }
        return [data.ParentID || "", data.ID];
    }

    getSubVariable(reference: ReferenceNumber) {
        const frameId = ThreadInfo.getFrameId(reference);
        const data = this.subvars.get(frameId);
        return data;
    }

    getSubVariableReference(reference: ReferenceNumber, vars: T[], dummyFrameID: FrameNumber): ReferenceNumber | undefined {
        const frameId = ThreadInfo.getFrameId(reference);
        if (!this.frameInfo.has(frameId) && !this.subvars.has(frameId)) {
            return undefined;
        }

        this.subvars.set(dummyFrameID as FrameNumber, vars);

        return STRUCT_FIELD_MASK + dummyFrameID as ReferenceNumber;
    }

    static getFrameId(reference: ReferenceNumber) {
        const frameId = reference & FRAME_ID_MASK;
        return frameId as FrameNumber;
    }

    static isLocalScopeVariableReference(ref: ReferenceNumber): boolean {
        return (ref & LOCAL_SCOPE_MASK) === LOCAL_SCOPE_MASK;
    }

    static isRegisterScopeVariableReference(ref: ReferenceNumber): boolean {
        return (ref & REGISTER_SCOPE_MASK) === REGISTER_SCOPE_MASK;
    }

    static isSubVariableReference(ref: ReferenceNumber): boolean {
        return (ref & STRUCT_FIELD_MASK) === STRUCT_FIELD_MASK;
    }
}

export class LifetimeDebugSession extends AsyncDebugSession {
    private frameIdCounter = 0;
    private threadInfo: Map<number, ThreadInfo<ClientVariable>> = new Map();

    private invalidateObjectReferences(threadId: number) {
        this.threadInfo.delete(threadId);
        //We could in theory reset the counter entirely...
        if (this.threadInfo.size === 0) {
            this.frameIdCounter = 0;
        }
    }

    private getOrCreateThreadInfo(threadId: number) {
        let t = this.threadInfo.get(threadId);
        if (t === undefined) {
            t = new ThreadInfo();
            this.threadInfo.set(threadId, t);
        }

        return t;
    }

    //stack frame ID must be *unique* across all threads and will be used to get the scopes of the frame
    protected createNextStackFrameId(thread: number, context: TCFContextDataStackTrace) {
        if (!context.ParentID) {
            console.log(`Stack frame context with unknown parent ${JSON.stringify(context)}`);
        }
        const frameId = this.frameIdCounter++ as FrameNumber;
        const t = this.getOrCreateThreadInfo(thread);
        t.frameInfo.set(frameId, context);
        return frameId;
    }

    protected getStackFrameDetails(reference: number): [string, string] {
        //since we don't know which thread owns this reference, just ask them all
        for (const thread of this.threadInfo.values()) {
            const stackFrameDetails = thread.getStackFrameDetails(reference as ReferenceNumber);
            if (stackFrameDetails !== undefined) {
                return stackFrameDetails;
            }
        }

        throw new Error(`Unknown object reference ${reference}`);
    }

    protected onThreadSuspended(thread: number) {
        this.invalidateObjectReferences(thread);
    }

    protected onThreadResumed(thread: number) {
        this.invalidateObjectReferences(thread);
    }

    protected isLocalScopeVariableReference(ref: number): boolean {
        return ThreadInfo.isLocalScopeVariableReference(ref as ReferenceNumber);
    }
    protected isRegisterScopeVariableReference(ref: number): boolean {
        return ThreadInfo.isRegisterScopeVariableReference(ref as ReferenceNumber);
    }
    protected isSubVariableReference(ref: number): boolean {
        return ThreadInfo.isSubVariableReference(ref as ReferenceNumber);
    }

    /**
     * @param ref an existing object reference
     * @returns a (sub-)reference, usually for struct fields, etc.
     */
    protected createSubVariableReference(ref: number, vars: ClientVariable[]): number {
        //we allocate a dummy frameID for this sub-variable so ThreadInfo generates a unique reference value
        const newId = this.frameIdCounter++;

        //since we don't know which thread owns this frameID, just ask them all
        for (const thread of this.threadInfo.values()) {
            const subref = thread.getSubVariableReference(ref as ReferenceNumber, vars, newId as FrameNumber);
            if (subref !== undefined) {
                return subref;
            }
        }

        throw new Error(`Unknown stack frame ${ThreadInfo.getFrameId(ref as ReferenceNumber)}`);
    }

    getSubVariable(reference: number): ClientVariable[] {
        //since we don't know which thread owns this frameID, just ask them all
        for (const thread of this.threadInfo.values()) {
            const info = thread.getSubVariable(reference as ReferenceNumber);
            if (info !== undefined) {
                return info;
            }
        }

        throw new Error(`Unknown sub variable reference ${reference}`);
    }

    protected getLocalScopeVariableReference(frameId: number) {
        //since we don't know which thread owns this frameID, just ask them all
        for (const thread of this.threadInfo.values()) {
            const ref = thread.getLocalScopeVariableReference(frameId as FrameNumber);
            if (ref !== undefined) {
                return ref;
            }
        }

        throw new Error(`Unknown stack frame ${frameId}`);
    }

    protected getRegisterScopeVariableReference(frameId: number) {
        //since we don't know which thread owns this frameID, just ask them all
        for (const thread of this.threadInfo.values()) {
            const ref = thread.getRegisterScopeVariableReference(frameId as FrameNumber);
            if (ref !== undefined) {
                return ref;
            }
        }

        throw new Error(`Unknown stack frame ${frameId}`);
    }

}