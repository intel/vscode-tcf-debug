/*
Copyright (C) 2023 Intel Corporation
SPDX-License-Identifier: MIT
*/
import { ValidatingCommand, asNullable, asString, asStringNullableArray, validateJSON } from "./tcfutils";
import * as validateRegistersContextData from './validators/validate-RegistersContextData';

abstract class RegistersValidatingCommand<T> extends ValidatingCommand<T> {
    constructor() {
        super();
    }

    service(): string {
        return "Registers";
    }

    debugDescription(tokenID: number): string {
        return `${this.service()}/${tokenID}`;
    }

}

//see https://download.eclipse.org/tools/tcf/tcf-docs/TCF%20Service%20-%20Registers.html#CmdGetContext
export interface RegistersContextData {
    /* eslint-disable @typescript-eslint/naming-convention */
    ID: string,
    ParentID?: string,
    ProcessID?: string,
    Name?: string,
    Description?: string,
    Size?: number,
    Readable?: boolean,
    ReadOnce?: boolean,
    //and many more other fields...
    Role?: string
    /* eslint-enable */
}

export function asRegistersContextData(result: any): RegistersContextData {
    return validateJSON(result, validateRegistersContextData) as RegistersContextData; //type assertion OK
}

//see https://download.eclipse.org/tools/tcf/tcf-docs/TCF%20Service%20-%20Registers.html#CmdGetContext
export class GetContextRegistersCommand extends RegistersValidatingCommand<RegistersContextData | null> {
    contextID: string;

    constructor(contextID: string) {
        super();
        this.contextID = contextID;
    }

    debugDescription(tokenID: number): string {
        return super.debugDescription(tokenID) + "/" + this.command() + "/" + this.contextID;
    }

    command(): string {
        return "getContext";
    }

    arguments() {
        return this.contextID;
    }

    override cast(json: any): RegistersContextData | null {
        return asNullable(json, asRegistersContextData);
    }
}

//see https://download.eclipse.org/tools/tcf/tcf-docs/TCF%20Service%20-%20Registers.html#CmdGetChildren
export class GetChildrenRegistersCommand extends RegistersValidatingCommand<string[] | null> {
    parentContextID: string;

    constructor(parentContextID: string) {
        super();
        this.parentContextID = parentContextID;
    }

    debugDescription(tokenID: number): string {
        return super.debugDescription(tokenID) + "/" + this.command() + "/" + this.arguments();
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

//see https://download.eclipse.org/tools/tcf/tcf-docs/TCF%20Service%20-%20Registers.html#CmdGetRegister
export class GetRegistersCommand extends RegistersValidatingCommand<Buffer> {
    contextID: string;

    constructor(contextID: string) {
        super();
        this.contextID = contextID;
    }

    debugDescription(tokenID: number): string {
        return super.debugDescription(tokenID) + "/" + this.command() + "/" + this.arguments();
    }

    command(): string {
        return "get";
    }

    arguments() {
        return this.contextID;
    }

    override cast(json: any): Buffer {
        const s = asString(json); //validates
        return Buffer.from(s, "base64");
    }
}
