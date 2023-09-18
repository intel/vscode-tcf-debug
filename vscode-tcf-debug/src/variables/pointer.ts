/*
Copyright (C) 2023 Intel Corporation
SPDX-License-Identifier: MIT
*/
import assert = require("assert");
import { GetContextSymbolsCommand, TCFSymbolContextData, TCFTypeClass } from "../tcf-all";
import { AbstractVariable, ClientVariable, FixedNameProvider, NameProvider, RawValueProvider, UndefinedRawValueProvider, VariableHelper } from "./types";

export class PointerVariable extends AbstractVariable {
    private children: ClientVariable[] | undefined = undefined;
    helper: VariableHelper;

    _displayValue: string | undefined;
    loadedValue: boolean = false;

    constructor(type: TCFSymbolContextData, symbolDetails: TCFSymbolContextData | undefined, nameProvider: NameProvider, valueProvider: RawValueProvider, helper: VariableHelper) {
        super(type, symbolDetails, nameProvider, valueProvider);
        this.helper = helper;
    }

    async getChildren() {
        if (this.children === undefined) {
            await this.loadChildren();
        }
        return this.children ?? [];
    }

    async loadChildren() {
        if (this.type.BaseTypeID) {
            //XXX: it looks like we would need to recurse here, eg. we could have a pointer to a pointer to a struct, etc.
            const baseTypeDetails = await this.helper.sendCommand(new GetContextSymbolsCommand(this.type.BaseTypeID));
            // How to load the symbol for the pointed data?
            // It may not even be a symbol but just a memory region.
            // const symbolDetails = await this.helper.sendCommand(new GetContextSymbolsCommand(...)
            // or perhaps this.sendCommand(new EvaluateExpressionCommand(varName+"."+this.type.Name)) ?

            baseTypeDetails.Name = baseTypeDetails.Name + "*"; //TODO: marking this as a pointer type. Normally we should return the full list of types upstream and the client decides how to present it in the UI

            const v = this.helper.createVariable(baseTypeDetails, undefined /* no symbol data */, new FixedNameProvider("*"), new UndefinedRawValueProvider());
            if (v !== undefined) {
                this.children = [v];
            } else {
                this.children = []; //maybe display something generic? Like... "pointer to function"
            }
        } else {
            //TODO: log error?
            this.children = [];
        }
    }

    async displayValue(): Promise<string | undefined> {
        if (!this.loadedValue) {
            this.loadedValue = true;
            this._displayValue = await this.loadValue();
        }
        return this._displayValue;
    }

    async loadValue(): Promise<string | undefined> {
        const variableRawValue = await this.valueProvider.value();
        if (!variableRawValue) {
            return undefined;
        }

        assert(this.type.TypeClass === TCFTypeClass.pointer);
        const value = '0x' + variableRawValue.toString('hex');
        //TODO: actually read memory and load that type?
        //const expr = "*(${" + typeDetails[0].ID + "})" + (variableRawValue.toString('hex'));
        //const v = new EvaluateExpressionCommand(expr);
        return value;
    }

}
