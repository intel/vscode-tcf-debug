/*
Copyright (C) 2022, 2023 Intel Corporation
SPDX-License-Identifier: MIT
*/
import { TCFCodeAreaLineNumbers } from './linenumbers';
import { asNullableArray, asStringNullableArray, handleError, handleErrorBuffer, PromiseError, PromiseSuccess, SimpleCommand, validateJSON, ValidatingCommand } from './tcfutils';
import * as validateTCFContextDataStackTrace from './validators/validate-TCFContextDataStackTrace';

let tokenCounter = 0;

abstract class StackTraceCommand<T> extends SimpleCommand<T> {
    constructor() {
        super(tokenCounter++);
    }

    service(): string {
        return "StackTrace";
    }

    token(): string {
        return `${this.service()}/${this.tokenID}`;
    }

}

abstract class StackTraceValidatingCommand<T> extends ValidatingCommand<T> {
    constructor() {
        super(tokenCounter++);
    }

    service(): string {
        return "StackTrace";
    }

    token(): string {
        return `${this.service()}/${this.tokenID}`;
    }

}

//see https://download.eclipse.org/tools/tcf/tcf-docs/TCF%20Service%20-%20Stack%20Trace.html#CmdGetChildren
export class GetChildrenStackTraceCommand extends StackTraceValidatingCommand<string[] | null> {
    parentContextId: string;

    constructor(parentContextId: string) {
        super();
        this.parentContextId = parentContextId;
    }

    token(): string {
        return super.token() + "/" + this.command() + "/" + this.arguments();
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

    token(): string {
        return super.token() + "/" + this.command() + "/" + this.arguments().join("+");
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
