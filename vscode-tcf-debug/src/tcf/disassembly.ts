/*
Copyright (C) 2023 Intel Corporation
SPDX-License-Identifier: MIT
*/
import { ValidatingCommand, asNullableArray, toBuffer, validateJSON } from './tcfutils';
import * as validateDisassemblyLine from './validators/validate-DisassemblyLine';
import * as validateDisassemblyCapability from './validators/validate-DisassemblyCapability';

abstract class DisassemblyCommand<T> extends ValidatingCommand<T> {

    constructor() {
        super();
    }

    service(): string {
        return "Disassembly";

    }

    debugDescription(tokenID: number): string {
        return `${this.service()}/${tokenID}`;
    }

}

//see https://download.eclipse.org/tools/tcf/tcf-docs/TCF%20Service%20-%20Disassembly.html#CmdGetCapabilities
/* eslint-disable @typescript-eslint/naming-convention */
export interface DisassemblyCapability {
    ISA?: string;
    Simplified?: boolean;
    PseudoInstruction?: boolean;
    OpcodeValue?: boolean;
}
/* eslint-enable */

//see https://download.eclipse.org/tools/tcf/tcf-docs/TCF%20Service%20-%20Disassembly.html#CmdGetCapabilities
export class GetCapabilitiesDisassemblyCommand extends DisassemblyCommand<DisassemblyCapability[] | null> {
    contextID: string;

    constructor(contextID: string) {
        super();
        this.contextID = contextID;
    }

    cast(json: any): DisassemblyCapability[] | null {
        return asNullableArray(json, asDisassemblyCapability);
    }

    command(): string {
        return "getCapabilities";
    }

    arguments() {
        return this.contextID;
    }

}

//see https://download.eclipse.org/tools/tcf/tcf-docs/TCF%20Service%20-%20Disassembly.html#CmdDisassemble
/* eslint-disable @typescript-eslint/naming-convention */
export interface DisassemblyLine {
    ISA?: string, //The spec doesn't mention this as optional, but in practice it is
    Address: number,
    Size: number,
    Instruction: DisassemblyInstructionField[] | null,
    OpcodeValue?: string //The spec doesn't mention this as optional, but in practice it is
}

export enum DisassemblyInstructionFieldTypes {
    string = "String",
    register = "Register",
    address = "Address",
    displacement = "Displacement",
    immediate = "Immediate"
}

export interface DisassemblyInstructionField {
    Type: string, // usually one of the DisassemblyInstructionFieldTypes values
    Text: string,
    Value?: number,
    AddressSpace?: string //context id
}

export interface DisassemblyParameters {
    ISA: string, //TODO: are these optional?
    Simplified: boolean,
    PseudoInstructions: boolean,
    OpcodeValue: boolean
}
/* eslint-enable */

function asDisassemblyLine(json: any): DisassemblyLine {
    return validateJSON(json, validateDisassemblyLine) as DisassemblyLine; //type assertion OK
}

function asDisassemblyCapability(json: any): DisassemblyCapability {
    return validateJSON(json, validateDisassemblyCapability) as DisassemblyCapability; //type assertion OK
}

//see https://download.eclipse.org/tools/tcf/tcf-docs/TCF%20Service%20-%20Disassembly.html#CmdDisassemble
export class DisassembleDisassemblyCommand extends DisassemblyCommand<DisassemblyLine[] | null> {
    contextID: string;
    startLocation: number;
    size: number;
    params: DisassemblyParameters;

    constructor(contextID: string, startLocation: number, size: number, params: DisassemblyParameters) {
        super();
        this.contextID = contextID;
        this.startLocation = startLocation;
        this.size = size;
        this.params = params;
    }

    cast(json: any): DisassemblyLine[] | null {
        return asNullableArray(json, asDisassemblyLine);
    }

    command(): string {
        return "disassemble";
    }

    arguments() {
        return undefined;
    }

    toBuffer(token: string): Buffer {
        return toBuffer(["C", token, this.service(), this.command(), JSON.stringify(this.contextID), JSON.stringify(this.startLocation), JSON.stringify(this.size), JSON.stringify(this.params)]);
    }

} 