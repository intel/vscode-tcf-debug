/*
Copyright (C) 2022, 2023 Intel Corporation
SPDX-License-Identifier: MIT
*/
import { toBuffer, SimpleCommand, PromiseSuccess, PromiseError, parseEmptyResponse, handleErrorBuffer, responseLengthAbout, handleError, ValidatingCommand, asStringNullableArray, validateJSON, asNullable } from './tcfutils';
import * as validateTCFStateData from './validators/validate-TCFStateData';
import * as validateTCFContextData from './validators/validate-TCFContextData';
import * as validateContextSuspendedData from './validators/validate-ContextSuspendedData';

let tokenCounter = 0;

//see https://download.eclipse.org/tools/tcf/tcf-docs/TCF%20Service%20-%20Run%20Control.html#CmdGetContext
/* eslint-disable @typescript-eslint/naming-convention */
export interface TCFContextData {
    ID: string,
    ParentID?: string,
    ProcessID?: string,
    //CreatorID?: string,
    Name?: string,
    IsContainer?: boolean,
    HasState?: boolean,
    CanSuspend?: boolean,
    CanResume?: number,
    CanCount?: number,
    CanTerminate?: boolean,
    CanDetach?: boolean,
    RCGroup?: string,
    //BPGroup?: string,
    SymbolsGroup?: string,
    RegAccessTypes?: string[]
    WordSize?: number, //not spec, seen in the wild
    CPUGroup?: string //not spec, seen in the wild
}
/* eslint-enable */

export function asNullableTCFContextData(result: any): TCFContextData | null {
    return asNullable(result, asTCFContextData);
}

export function asTCFContextData(result: any): TCFContextData {
    return validateJSON(result, validateTCFContextData) as TCFContextData; //type assertion OK
}

abstract class RunControlCommand<T> extends SimpleCommand<T> {
    constructor() {
        super(tokenCounter++);
    }

    service(): string {
        return "RunControl";
    }

    token(): string {
        return `${this.service()}/${this.tokenID}`;
    }

}

abstract class RunControlValidatingCommand<T> extends ValidatingCommand<T> {
    constructor() {
        super(tokenCounter++);
    }

    service(): string {
        return "RunControl";
    }

    token(): string {
        return `${this.service()}/${this.tokenID}`;
    }

}

/**
 * A command with not response to parse. 
 */
abstract class RunControlEmptyCommand extends RunControlCommand<undefined> {

    result(responseAll: Buffer[], success: PromiseSuccess<undefined>, error: PromiseError<undefined>): void {
        parseEmptyResponse(responseAll, success, error);
    }
}


/**
 * *Note*: This command only *starts* a suspend. The actual execution happens asynchronously. Only the contextSuspended event will certify suspend actually happened.
 *
 * @see https://download.eclipse.org/tools/tcf/tcf-docs/TCF%20Service%20-%20Run%20Control.html#CmdSuspend
 */
export class SuspendRunControlCommand extends RunControlEmptyCommand {
    contextID: string;

    constructor(contextID: string) {
        super();
        this.contextID = contextID;
    }

    token(): string {
        return super.token() + "/" + this.command() + "/" + this.contextID;
    }

    command(): string {
        return "suspend";
    }

    arguments() {
        return this.contextID;
    }
}

export enum Modes {
    normalExecution = 0,
    nextLine = 3,
    stepIn = 4,
    stepOut = 5
}

/**
 * *Note*: This command only *starts* a resume. The actual execution happens asynchronously. Only the contextResumed event will certify resume actually happened.
 *
 * @see https://download.eclipse.org/tools/tcf/tcf-docs/TCF%20Service%20-%20Run%20Control.html#CmdResume
 */
export class ResumeRunControlCommand extends RunControlEmptyCommand {
    contextID: string;
    mode: Modes;

    constructor(contextID: string, mode: Modes = Modes.normalExecution) {
        super();
        this.contextID = contextID;
        this.mode = mode;
    }

    token(): string {
        return super.token() + "/" + this.command() + "/" + this.contextID;
    }

    command(): string {
        return "resume";
    }

    arguments() {
        return undefined;
    }

    toBuffer(): Buffer {

        const count = "1"; //doesn't matter, normal execution has no count
        //XXX: JSON stringifying the context ID is very important!
        return toBuffer(["C", this.token(), this.service(), this.command(), JSON.stringify(this.contextID), this.mode.toString(), count], undefined);
    }
}

//see https://download.eclipse.org/tools/tcf/tcf-docs/TCF%20Service%20-%20Run%20Control.html#CmdGetContext
export class GetContextRunControlCommand extends RunControlValidatingCommand<TCFContextData | null> {
    contextID: string;

    constructor(contextID: string) {
        super();
        this.contextID = contextID;
    }

    token(): string {
        return super.token() + "/" + this.command() + "/" + this.contextID;
    }

    command(): string {
        return "getContext";
    }

    arguments() {
        return this.contextID;
    }

    override cast(json: any): TCFContextData | null {
        return asNullableTCFContextData(json);
    }
}

//see https://download.eclipse.org/tools/tcf/tcf-docs/TCF%20Service%20-%20Run%20Control.html#CmdGetChildren
export class GetChildrenRunControlCommand extends RunControlValidatingCommand<string[] | null> {
    parentContextID: string | null;

    constructor(parentContextID: string | null) {
        super();
        this.parentContextID = parentContextID;
    }

    token(): string {
        return super.token() + "/" + this.command() + "/" + this.arguments();
    }

    command(): string {
        return "getChildren";
    }

    arguments() {
        return this.parentContextID;
    }

    toBuffer(): Buffer {
        //this needs to be explicit since arguments can also be null and must be serialized as null
        return toBuffer(["C", this.token(), this.service(), this.command()], this.arguments(), true);
    }

    override cast(json: any): string[] | null {
        return asStringNullableArray(json);
    }
}

export interface TCFStateData {
    suspended: boolean,
    pc: number,
    lastStateReason: string | null,
    data: StateData | null
}

export function asTCFStateData(result: any): TCFStateData {
    return validateJSON(result, validateTCFStateData) as TCFStateData; //type assertion OK
}

//see https://download.eclipse.org/tools/tcf/tcf-docs/TCF%20Service%20-%20Run%20Control.html#CmdGetState
export class GetStateRunControlCommand extends RunControlCommand<TCFStateData> {
    contextID: string;

    constructor(contextID: string) {
        super();
        this.contextID = contextID;
    }

    token(): string {
        return super.token() + "/" + this.command() + "/" + this.arguments();
    }

    command(): string {
        return "getState";
    }

    arguments() {
        return this.contextID;
    }

    result(responseAll: Buffer[], success: PromiseSuccess<TCFStateData>, error: PromiseError<TCFStateData>): void {
        const [resultError, ...response] = responseAll;

        if (handleErrorBuffer(resultError, error)) {
            return;
        }

        const [suspended, pc, lastStateReason, data] =
            [JSON.parse(response[0].toString()), //validated below with asTCFStateData
            JSON.parse(response[1].toString()), //validated below with asTCFStateData
            JSON.parse(response[2].toString()), //validated below with asTCFStateData
            JSON.parse(response[3].toString()) //validated below with asTCFStateData
            ];

        try {
            success(asTCFStateData({
                suspended,
                pc,
                lastStateReason,
                data
            }));
        } catch (e) {
            handleError(e, error);
        }
    }

}

//see https://download.eclipse.org/tools/tcf/tcf-docs/TCF%20Service%20-%20Run%20Control.html#CmdGetState
/* eslint-disable @typescript-eslint/naming-convention */
export interface StateData {
    Signal?: number,
    SignalName?: string,
    SignalDescription?: string,
    BPs?: string[],
    PCError?: object,
    StepError?: object,
    FuncCall?: boolean,
    Reversing?: boolean,
    Context?: string,
    CPU?: string,
    StateName?: string
}
/* eslint-enable */

export interface ContextSuspendedData { //TODO: is this TCFStateData?
    id: string, //context ID
    pc: number,
    reason: string,
    data: StateData | null
}

export function asContextSuspendedData(result: any): ContextSuspendedData {
    return validateJSON(result, validateContextSuspendedData) as ContextSuspendedData; //type assertion OK
}

export function parseContextSuspended(response: Buffer[]): ContextSuspendedData | null {
    if (!responseLengthAbout(4, response)) {
        return null;
    }

    const [contextID, pc, reason, data] =
        [JSON.parse(response[0].toString()), //validated below with asContextSuspendedData
        JSON.parse(response[1].toString()), //validated below with asContextSuspendedData
        JSON.parse(response[2].toString()), //validated below with asContextSuspendedData
        JSON.parse(response[3].toString()) //validated below with asContextSuspendedData
        ];

    return asContextSuspendedData({
        id: contextID,
        pc,
        reason,
        data
    });
}