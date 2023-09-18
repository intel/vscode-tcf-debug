/*
Copyright (C) 2023 Intel Corporation
SPDX-License-Identifier: MIT
*/
import { PromiseError, PromiseSuccess, SimpleCommand, ValidatingCommand, asString, asStringNullableArray, handleError, handleErrorBuffer, responseLengthAbout, toBuffer, validateJSON } from "./tcfutils";
import * as validateMemoryResult from './validators/validate-MemoryResult';

let tokenCounter = 0;

abstract class MemoryCommand<T> extends SimpleCommand<T> {
    constructor() {
        super(tokenCounter++);
    }

    service(): string {
        return "Memory";
    }

    token(): string {
        return `${this.service()}/${this.tokenID}`;
    }

}

abstract class MemoryValidatingCommand<T> extends ValidatingCommand<T> {
    constructor() {
        super(tokenCounter++);
    }

    service(): string {
        return "Memory";
    }

    token(): string {
        return `${this.service()}/${this.tokenID}`;
    }

}


//see https://download.eclipse.org/tools/tcf/tcf-docs/TCF%20Service%20-%20Memory.html#CmdGetChildren
export class GetChildrenMemoryCommand extends MemoryValidatingCommand<string[] | null> {
    parentContextID: string | null;

    constructor(parentContextID: string | null) {
        super();
        this.parentContextID = parentContextID;
    }

    command(): string {
        return "getChildren";
    }

    arguments() {
        return this.parentContextID;
    }

    override cast(json: any): string[] | null {
        return asStringNullableArray(json);
    }
}

export interface MemoryErrorAddress {
    addr: number,
    size: number,
    stat: number,
    msg: any
}

export interface MemoryResult {
    base64: string,
    errorAddresses: MemoryErrorAddress[] | null
}

export function asMemoryResult(result: any): MemoryResult {
    return validateJSON(result, validateMemoryResult) as MemoryResult; //type assertion OK
}

//see https://download.eclipse.org/tools/tcf/tcf-docs/TCF%20Service%20-%20Memory.html#CmdGetMemory
export class GetMemoryCommand extends MemoryCommand<MemoryResult> {
    contextID: string;
    address: number;
    wordSize: number;
    byteCount: number;
    mode: number;

    constructor(contextID: string, address: number, wordSize: number, byteCount: number, mode: number = 0) {
        super();
        this.contextID = contextID;
        this.address = address;
        this.wordSize = wordSize;
        this.byteCount = byteCount;
        this.mode = mode;
    }

    command(): string {
        return "get";
    }

    arguments() {
        return undefined;
    }

    toBuffer(): Buffer {
        return toBuffer(["C", this.token(), this.service(), this.command(),
            JSON.stringify(this.contextID), JSON.stringify(this.address), JSON.stringify(this.wordSize),
            JSON.stringify(this.byteCount), JSON.stringify(this.mode)], undefined);
    }

    result(responseAll: Buffer[], success: PromiseSuccess<MemoryResult>, error: PromiseError<MemoryResult>): void {
        parseMemoryResponse(responseAll, success, error);
    }
}

export function parseMemoryResponse(responseAll: Buffer[], success: PromiseSuccess<MemoryResult>, error: PromiseError<MemoryResult>): void {
    const [response, resultError, errorAddresses, ...etc] = responseAll;

    if (handleErrorBuffer(resultError, error)) {
        return;
    }

    if (!responseLengthAbout(0, etc)) {
        console.log(`Response should have a single JSON, got ${response.length} buffers`);
    }

    try {
        success(asMemoryResult({
            base64: asString(JSON.parse(response.toString())),
            errorAddresses: JSON.parse(errorAddresses.toString()) as MemoryErrorAddress[] //type assertion OK
        })); //base64 string
    } catch (e) {
        handleError(e, error);
    }
}
