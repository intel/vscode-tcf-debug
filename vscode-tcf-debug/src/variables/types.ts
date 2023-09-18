/*
Copyright (C) 2023 Intel Corporation
SPDX-License-Identifier: MIT
*/
import { SimpleCommand, TCFSymbolContextData } from "../tcf-all";

export interface NameProvider {
    name(): string | undefined;
}
export interface RawValueProvider {
    value(): Promise<Buffer | undefined>;
    isBigEndian(): boolean;
}

export interface ClientVariable extends RawValueProvider, NameProvider {
    type: TCFSymbolContextData,

    getChildren(): Promise<ClientVariable[]>; //for array/struct

    displayValue(): Promise<string | undefined>;

    isRegister(): boolean;
}

export interface VariableHelper {
    sendCommand<T>(c: SimpleCommand<T>): Promise<T>;
    createVariable(type: TCFSymbolContextData, symbolDetails: TCFSymbolContextData | undefined, nameProvider: NameProvider, valueProvider: RawValueProvider): ClientVariable | undefined;
}

export class SymbolNameProvider implements NameProvider {
    _name: string;
    constructor(symbolDetails: TCFSymbolContextData) {
        this._name = symbolDetails.Name || (symbolDetails.Register || "");
    }

    name() {
        return this._name;
    }
}

export class FixedNameProvider implements NameProvider {
    _name: string;

    constructor(name: string) {
        this._name = name;
    }

    name(): string | undefined {
        return this._name;
    }
}

export abstract class AbstractVariable implements ClientVariable {
    type: TCFSymbolContextData;
    valueProvider: RawValueProvider;
    nameProvider: NameProvider;
    register: boolean = false;

    constructor(type: TCFSymbolContextData, symbolDetails: TCFSymbolContextData | undefined, nameProvider: NameProvider, valueProvider: RawValueProvider) {
        this.type = type;
        this.valueProvider = valueProvider;
        this.nameProvider = nameProvider;
        this.register = symbolDetails?.Register !== undefined;
    }

    value(): Promise<Buffer | undefined> {
        return this.valueProvider.value();
    }

    isBigEndian(): boolean {
        return this.valueProvider.isBigEndian();
    }

    abstract getChildren(): Promise<ClientVariable[]>;
    abstract displayValue(): Promise<string | undefined>;
    isRegister(): boolean {
        return this.register;
    }

    name() {
        return this.nameProvider.name();
    }
}

export class UndefinedRawValueProvider implements RawValueProvider {
    async value(): Promise<Buffer | undefined> {
        return undefined;
    }
    isBigEndian(): boolean {
        return false; //doesn't matter.
    }
}
