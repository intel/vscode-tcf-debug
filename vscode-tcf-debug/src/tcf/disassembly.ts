/*
Copyright (C) 2023 Intel Corporation
SPDX-License-Identifier: MIT
*/
import { ValidatingCommand, toBuffer, validateJSON } from './tcfutils';

let tokenCounter = 0;

abstract class DisassemblyCommand<T> extends ValidatingCommand<T> {

    constructor() {
        super(tokenCounter++);
    }

    service(): string {
        return "Disassembly";

    }

    token(): string {
        return `${this.service()}/${this.tokenID}`;
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
        return json as DisassemblyCapability[] | null; //TODO: validate!
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
    ISA: string,
    Address: number,
    Size: number,
    Instruction: DisassemblyInstructionField[] | null,
    OpcodeValue: string
}

export enum DisassemblyInstructionFieldTypes {
    string = "String",
    register = "Register",
    address = "Address",
    displacement = "Displacement",
    immediate = "Immediate"
}

export interface DisassemblyInstructionField {
    Type: DisassemblyInstructionFieldTypes | string,
    Text: string,
    Value: number,
    AddressSpace: string //context id
}

export interface DisassemblyParameters {
    ISA: string, //TODO: are these optional?
    Simplified: boolean,
    PseudoInstructions: boolean,
    OpcodeValue: boolean
}
/* eslint-enable */

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
        return json as DisassemblyLine[] | null; //TODO: validate!
    }

    command(): string {
        return "disassemble";
    }

    arguments() {
        return undefined;
    }

    toBuffer(): Buffer {
        return toBuffer(["C", this.token(), this.service(), this.command(), JSON.stringify(this.contextID), JSON.stringify(this.startLocation), JSON.stringify(this.size), JSON.stringify(this.params)], null);
    }

} 