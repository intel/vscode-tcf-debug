/*
Copyright (C) 2022, 2023 Intel Corporation
SPDX-License-Identifier: MIT
*/
import { TCFCodeAreaLineNumbers } from './linenumbers';
import { asNullableArray, asStringNullableArray, handleError, handleErrorBuffer, PromiseError, PromiseSuccess, SimpleCommand, validateJSON, ValidatingCommand, toBuffer } from './tcfutils';
import * as validateTCFContextDataStackTrace from './validators/validate-TCFContextDataStackTrace';

const DEFAULT_STACKTRACE_RANGE = 20;

abstract class StackTraceCommand<T> extends SimpleCommand<T> {
    constructor() {
        super();
    }

    service(): string {
        return "StackTrace";
    }

    debugDescription(tokenID: number): string {
        return `${this.service()}/${tokenID}`;
    }

}

abstract class StackTraceValidatingCommand<T> extends ValidatingCommand<T> {
    constructor() {
        super();
    }

    service(): string {
        return "StackTrace";
    }

    debugDescription(tokenID: number): string {
        return `${this.service()}/${tokenID}`;
    }

}

//see https://download.eclipse.org/tools/tcf/tcf-docs/TCF%20Service%20-%20Stack%20Trace.html#CmdGetChildren
export class GetChildrenStackTraceCommand extends StackTraceValidatingCommand<string[] | null> {
    parentContextId: string;

    constructor(parentContextId: string) {
        super();
        this.parentContextId = parentContextId;
    }

    debugDescription(tokenID: number): string {
        return super.debugDescription(tokenID) + "/" + this.command() + "/" + this.arguments();
    }

    command(): string {
        return "getChildren";
    }

    arguments(): string {
        return this.parentContextId;
    }

    override cast(json: any): string[] | null {
        return asStringNullableArray(json);
    }
}

//see https://download.eclipse.org/tools/tcf/tcf-docs/TCF%20Service%20-%20Stack%20Trace.html#CmdGetChildrenRange
export class GetChildrenRangeStackTraceCommand extends StackTraceValidatingCommand<string[] | null> {
    parentContextId: string;
    startRange: number;
    endRange: number;

    constructor(parentcontextId: string, start: number = 0, end: number = DEFAULT_STACKTRACE_RANGE - 1) {
        super();
        this.parentContextId = parentcontextId;
        this.startRange = start;
        this.endRange = end;
    }

    debugDescription(tokenID: number): string {
        return `${super.debugDescription(tokenID)}/${this.command()}/${this.parentContextId}-${this.startRange}:${this.endRange}`;
    }

    command(): string {
        return "getChildrenRange";
    }

    arguments(): any {
        return undefined; //custom serialization
    }

    override cast(json: any): string[] | null {
        return asStringNullableArray(json);
    }

    toBuffer(token: string): Buffer {
        return toBuffer(["C", token, this.service(), this.command(), JSON.stringify(this.parentContextId), JSON.stringify(this.startRange), JSON.stringify(this.endRange)]);
    }

}


/* eslint-disable @typescript-eslint/naming-convention */
export interface TCFContextDataStackTrace {
    ID: string,
    ParentID?: string,
    ProcessID?: string,
    Name?: string,
    TopFrame?: boolean,
    Index?: number,
    Walk?: boolean,
    FP?: number,
    RP?: number,
    IP?: number,
    ArgsCnt?: number,
    ArgsAddr?: number,
    CodeArea?: TCFCodeAreaLineNumbers,
    FuncID?: string
}
/* eslint-enable */

function asTCFContextDataStackTrace(json: any) {
    return validateJSON(json, validateTCFContextDataStackTrace) as TCFContextDataStackTrace; //type assertion OK
}

function asTCFContextDataStackTraceNullableArray(result: any): TCFContextDataStackTrace[] | null {
    return asNullableArray(result, asTCFContextDataStackTrace);
}

//see https://download.eclipse.org/tools/tcf/tcf-docs/TCF%20Service%20-%20Stack%20Trace.html#CmdGetContext
export class GetContextStackTraceCommand extends StackTraceCommand<TCFContextDataStackTrace[]> {
    contextIDs: string[];

    constructor(contextIDs: string[]) {
        super();
        this.contextIDs = contextIDs;
    }

    debugDescription(tokenID: number): string {
        return super.debugDescription(tokenID) + "/" + this.command() + "/" + this.arguments().join("+");
    }

    command(): string {
        return "getContext";
    }

    arguments(): string[] {
        return this.contextIDs;
    }

    result(responseAll: Buffer[], success: PromiseSuccess<TCFContextDataStackTrace[]>, error: PromiseError<null>): void /* TCFContextDataStackTrace[] */ {
        //error and response are REVERSED!
        const [response, resultError, ...misc] = responseAll;

        if (!handleErrorBuffer(resultError, error)) {
            try {
                success(asTCFContextDataStackTraceNullableArray(JSON.parse(response.toString())) ?? []);
            } catch (e) {
                handleError(e, error);
            }
        }
    }
}
