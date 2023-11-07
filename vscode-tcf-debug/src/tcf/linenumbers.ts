/*
Copyright (C) 2022, 2023 Intel Corporation
SPDX-License-Identifier: MIT
*/
import { ValidatingCommand, asNullableArray, toBuffer, validateJSON } from './tcfutils';
import * as validateTCFCodeAreaLineNumbers from './validators/validate-TCFCodeAreaLineNumbers';

abstract class LineNumbersCommand<T> extends ValidatingCommand<T> {

    constructor() {
        super();
    }

    service(): string {
        return "LineNumbers";
    }

    debugDescription(tokenID: number): string {
        return `${this.service()}/${tokenID}`;
    }

}

/* eslint-disable @typescript-eslint/naming-convention */
export interface TCFCodeAreaLineNumbers {
    SLine?: number,
    SCol?: number,
    SAddr?: number,
    ELine?: number,
    ECol?: number,
    EAddr?: number
    NAddr?: number,
    File?: string
    Dir?: string,
    ISA?: number,
    IsStmt?: boolean,
    BasicBlock?: boolean,
    PrologueEnd?: boolean,
    EpilogueBegin?: boolean,
    OpIndex?: number,
    Discriminator?: number,
    NStmtAddr?: number
}
/* eslint-enable */

function asTCFCodeAreaLineNumbers(json: any) {
    return validateJSON(json, validateTCFCodeAreaLineNumbers) as TCFCodeAreaLineNumbers; //type assertion OK
}

//see https://download.eclipse.org/tools/tcf/tcf-docs/TCF%20Service%20-%20Line%20Numbers.html#CmdMapToSource
export class MapToSourceLineNumbersCommand extends LineNumbersCommand<TCFCodeAreaLineNumbers[] | null> {
    contextID: string;
    startAddress: number;
    endAddress: number;

    constructor(contextID: string, startAddress: number, endAddress: number) {
        super();
        this.contextID = contextID;
        this.startAddress = startAddress;
        this.endAddress = endAddress;
    }

    debugDescription(tokenID: number): string {
        return super.debugDescription(tokenID) + "/" + this.command() + "/" + [this.contextID, this.startAddress, this.endAddress].map(x => "" + x).join("+");
    }

    command(): string {
        return "mapToSource";
    }

    arguments() {
        return undefined;
    }

    toBuffer(token: string): Buffer {
        return toBuffer(["C", token, this.service(), this.command(), JSON.stringify(this.contextID), JSON.stringify(this.startAddress), JSON.stringify(this.endAddress)]);
    }

    override cast(json: any): TCFCodeAreaLineNumbers[] | null {
        return asNullableArray(json, asTCFCodeAreaLineNumbers);
    }
}

//see https://download.eclipse.org/tools/tcf/tcf-docs/TCF%20Service%20-%20Line%20Numbers.html#CmdMapToMemory
export class MapToMemoryLineNumbersCommand extends LineNumbersCommand<TCFCodeAreaLineNumbers[] | null> {
    contextID: string;
    file: string;
    line: number;
    column: number;

    constructor(contextID: string, file: string, line: number, column: number) {
        super();
        this.contextID = contextID;
        this.file = file;
        this.line = line;
        this.column = column;
    }

    debugDescription(tokenID: number): string {
        //file expressly removed from token. too noisy
        return super.debugDescription(tokenID) + "/" + this.command() + "/" + [this.contextID, this.line, this.column].map(x => "" + x).join("+");
    }

    command(): string {
        return "mapToMemory";
    }

    arguments() {
        return undefined;
    }

    toBuffer(token: string): Buffer {
        return toBuffer(["C", token, this.service(), this.command(), JSON.stringify(this.contextID), JSON.stringify(this.file), JSON.stringify(this.line), JSON.stringify(this.column)]);
    }

    override cast(json: any): TCFCodeAreaLineNumbers[] | null {
        return asNullableArray(json, asTCFCodeAreaLineNumbers);
    }
}
