/*
Copyright (C) 2022, 2023 Intel Corporation
SPDX-License-Identifier: MIT
*/
import { asString, asStringNullableArray, toBuffer, validateJSON, ValidatingCommand } from './tcfutils';
import * as validateTCFSymbolContextData from './validators/validate-TCFSymbolContextData';

abstract class SymbolsCommand<T> extends ValidatingCommand<T> {
    constructor() {
        super();
    }

    service(): string {
        return "Symbols";
    }

    debugDescription(tokenID: number): string {
        return `${this.service()}/${tokenID}`;
    }
}

//returns string
export class FindByAddrSymbolsCommand extends SymbolsCommand<string> {
    contextID: string;
    address: number;

    constructor(contextID: string, address: number) {
        super();
        this.contextID = contextID;
        this.address = address;
    }

    debugDescription(tokenID: number): string {
        return super.debugDescription(tokenID) + "/" + this.command() + "/" + this.contextID + "+" + this.address;
    }

    command(): string {
        return "findByAddr";
    }

    arguments() {
        return undefined;
    }

    toBuffer(token: string): Buffer {
        return toBuffer(["C", token, this.service(), this.command(), JSON.stringify(this.contextID), JSON.stringify(this.address)]);
    }

    override cast(json: any): string {
        return asString(json);
    }
}

/* eslint-disable @typescript-eslint/naming-convention */
export enum TCFSymbolClass {
    unknown,
    value,
    reference,
    function,
    type,
    comp_unit,
    block,
    namespace,
    variant_part,
    variant
}
/* eslint-enable */

/* eslint-disable @typescript-eslint/naming-convention */
export enum TCFTypeClass {
    unknown,
    cardinal,
    integer,
    real,
    pointer,
    array,
    composite,
    enumeration,
    function,
    member_pointer,
    complex
}
/* eslint-enable */

/* eslint-disable @typescript-eslint/naming-convention */
export interface TCFSymbolContextData {
    ID: string,
    OwnerID?: string,
    UpdatePolicy?: number,
    Name?: string | null,
    TypeClass?: TCFTypeClass,
    TypeID?: string,
    BaseTypeID?: string | null,
    //IndexTypeID?: string | null,
    ContainerID?: string | null,
    Size?: number,
    Length?: number, //array length
    //LowerBound?: number,
    //UpperBound?: number,
    //BitStride?: number,
    Offset?: number,
    Address?: number,
    Value?: string, //base64 string
    //BigEndian?: boolean,
    Register?: string,
    Flags?: number,
    Class: TCFSymbolClass
}
/* eslint-enable */

function asTCFSymbolContextData(json: any): TCFSymbolContextData {
    return validateJSON(json, validateTCFSymbolContextData) as TCFSymbolContextData; //type assertion OK
}

//returns TCFSymbolContextData
export class GetContextSymbolsCommand extends SymbolsCommand<TCFSymbolContextData> {
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

    override cast(json: any): TCFSymbolContextData {
        return asTCFSymbolContextData(json);
    }

}

/**
 * Get struct children.
 */
export class GetChildrenSymbolsCommand extends SymbolsCommand<string[] | null> {
    contextID: string;

    constructor(contextID: string) {
        super();
        this.contextID = contextID;
    }

    debugDescription(tokenID: number): string {
        return super.debugDescription(tokenID) + "/" + this.command() + "/" + this.contextID;
    }

    command(): string {
        return "getChildren";
    }

    arguments() {
        return this.contextID;
    }

    override cast(json: any): string[] | null {
        return asStringNullableArray(json);
    }
}
