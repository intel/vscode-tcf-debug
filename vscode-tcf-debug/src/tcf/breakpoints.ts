/*
Copyright (C) 2022, 2023 Intel Corporation
SPDX-License-Identifier: MIT
*/
import { asStringArray, parseEmptyResponse, PromiseError, PromiseSuccess, SimpleCommand, validateJSON, ValidatingCommand } from './tcfutils';
import * as validateBreakpointStatus from './validators/validate-BreakpointStatus';
import * as validateBreakpointData from './validators/validate-BreakpointData';

export function asBreakpointData(result: any): BreakpointData {
    return validateJSON(result, validateBreakpointData) as BreakpointData; //type assertion OK
}

export function asBreakpointStatus(result: any): BreakpointStatus {
    return validateJSON(result, validateBreakpointStatus) as BreakpointStatus; //type assertion OK
}

//global token counter
let tokenCounter = 0;

abstract class BreakpointsCommand<T> extends SimpleCommand<T> {
    constructor() {
        super(tokenCounter++);
    }

    service(): string {
        return "Breakpoints";
    }

    token(): string {
        return `${this.service()}/${this.tokenID}`;
    }

}

abstract class BreakpointsValidatingCommand<T> extends ValidatingCommand<T> {
    constructor() {
        super(tokenCounter++);
    }

    service(): string {
        return "Breakpoints";
    }

    token(): string {
        return `${this.service()}/${this.tokenID}`;
    }

}

/**
 * A command with not response to parse.
 */
abstract class BreakpointsEmptyCommand extends BreakpointsCommand<undefined> {

    override result(responseAll: Buffer[], success: PromiseSuccess<undefined>, error: PromiseError<undefined>): void {
        parseEmptyResponse(responseAll, success, error);
    }
}

//see https://download.eclipse.org/tools/tcf/tcf-docs/TCF%20Service%20-%20Breakpoints.html#CmdSet
/* eslint-disable @typescript-eslint/naming-convention */
enum BreakpointType {
    Software = "Software",
    Hardware = "Hardware",
    Auto = "Auto"
}
/* eslint-enable */

/* eslint-disable @typescript-eslint/naming-convention */
export interface BreakpointData {
    ID: string;
    Enabled: boolean;
    File?: string;
    Line?: number;
    BreakpointType?: BreakpointType;
    //TODO: ... and many more properties
}
/* eslint-enable */

//see https://download.eclipse.org/tools/tcf/tcf-docs/TCF%20Service%20-%20Breakpoints.html#CmdSet
export class SetBreakpointsCommand extends BreakpointsEmptyCommand {
    args: BreakpointData[];

    constructor(args: BreakpointData[]) {
        super();
        this.args = args;
    }

    token(): string {
        return super.token() + "/" + this.command() + "/" + this.argumentsHash();
    }

    command(): string {
        return "set";
    }

    arguments() {
        return this.args;
    }

    private argumentsHash(): number {
        return this.args.reduce((partialHash: number, data: BreakpointData, index: number, arr: BreakpointData[]) => {
            return Math.imul(31, partialHash) + this.dataHash(data);
        }, 0);
    }

    private dataHash(data: BreakpointData): number {
        let h = 0;
        if (data.File) {
            for (let i = 0; i < data.File.length; i++) {
                const c = data.File.charCodeAt(i);
                h = Math.imul(31, h) + c | 0;
            }
        }
        h = h + (data.Line || 0);
        return h;
    }

}

//see https://download.eclipse.org/tools/tcf/tcf-docs/TCF%20Service%20-%20Breakpoints.html#CmdAdd
export class AddBreakpointsCommand extends BreakpointsEmptyCommand {
    breakpoint: BreakpointData;

    constructor(breakpoint: BreakpointData) {
        super();
        this.breakpoint = breakpoint;
    }

    token(): string {
        return super.token() + "/" + this.command() + "/" + this.breakpoint.ID;
    }

    command(): string {
        return "add";
    }

    arguments() {
        return this.breakpoint;
    }

}

//see https://download.eclipse.org/tools/tcf/tcf-docs/TCF%20Service%20-%20Breakpoints.html#CmdRemove
export class RemoveBreakpointsCommand extends BreakpointsEmptyCommand {
    ids: string[];

    constructor(breakpointIds: string[]) {
        super();
        this.ids = breakpointIds;
    }

    token(): string {
        return super.token() + "/" + this.command() + "/" + this.ids.join("+");
    }

    command(): string {
        return "remove";
    }

    arguments() {
        return this.ids;
    }

}

/* eslint-disable @typescript-eslint/naming-convention */
export interface BreakpointStatus {
    Instances?: InstanceStatusData[] | null;
    Error?: string;
    File?: string;
    Line?: number;
    Column?: number;
}
/* eslint-enable */

/* eslint-disable @typescript-eslint/naming-convention */
export interface InstanceStatusData {
    Error?: string;
    BreakpointType?: string;
    LocationContext?: string;
    MemoryContext?: string;
    Address?: number | string; //seems to be deserialized as number...
    HitCount?: number;
    Size?: number;
    ConditionError?: string;
}
/* eslint-enable */

//see https://download.eclipse.org/tools/tcf/tcf-docs/TCF%20Service%20-%20Breakpoints.html#CmdGetIDs
//NOTE: This will return IDs set by *all* clients. The client should know its own breakpoint IDs.
export class GetIDsBreakpointsCommand extends BreakpointsValidatingCommand<string[]> {
    constructor() {
        super();
    }

    token(): string {
        return super.token() + "/" + this.command();
    }

    command(): string {
        return "getIDs";
    }

    arguments() {
        return undefined;
    }

    override cast(json: any): string[] {
        return asStringArray(json);
    }

}

//see https://download.eclipse.org/tools/tcf/tcf-docs/TCF%20Service%20-%20Breakpoints.html#CmdGetProperties
export class GetPropertiesBreakpointsCommand extends BreakpointsValidatingCommand<BreakpointData> {
    breakpointID: string;

    constructor(breakpointID: string) {
        super();
        this.breakpointID = breakpointID;
    }

    token(): string {
        return super.token() + "/" + this.command() + "/" + this.arguments();
    }

    command(): string {
        return "getProperties";
    }

    arguments() {
        return this.breakpointID;
    }

    override cast(json: any): BreakpointData {
        return asBreakpointData(json);
    }
}

//see https://download.eclipse.org/tools/tcf/tcf-docs/TCF%20Service%20-%20Breakpoints.html#CmdGetStatus
export class GetStatusBreakpointsCommand extends BreakpointsValidatingCommand<BreakpointStatus> {
    breakpointID: string;

    constructor(breakpointID: string) {
        super();
        this.breakpointID = breakpointID;
    }

    token(): string {
        return super.token() + "/" + this.command() + "/" + this.arguments();
    }

    command(): string {
        return "getStatus";
    }

    arguments() {
        return this.breakpointID;
    }

    override cast(json: any): BreakpointStatus {
        return asBreakpointStatus(json);
    }
}
