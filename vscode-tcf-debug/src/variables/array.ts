/*
Copyright (C) 2023 Intel Corporation
SPDX-License-Identifier: MIT
*/
import { GetContextSymbolsCommand, TCFSymbolContextData } from "../tcf-all";
import { AbstractVariable, ClientVariable, NameProvider, RawValueProvider, VariableHelper } from "./types";

export class ArrayVariable extends AbstractVariable {

    private children: ClientVariable[] | undefined = undefined;

    helper: VariableHelper;

    constructor(type: TCFSymbolContextData, helper: VariableHelper, nameProvider: NameProvider, valueProvider: RawValueProvider) {
        super(type, undefined, nameProvider, valueProvider);
        this.helper = helper;
    }
    async getChildren(): Promise<ClientVariable[]> {
        if (this.children === undefined) {
            await this.loadChildren();
        }
        return this.children ?? [];
    }

    async loadChildren() {
        if (!this.type.BaseTypeID) {
            return; //no known element type?
        }
        const baseTypeDetails = await this.helper.sendCommand(new GetContextSymbolsCommand(this.type.BaseTypeID));

        const symbolDetails = this.type; //TODO: Or do we need symbolDetails?
        const size = symbolDetails.Size;
        const length = symbolDetails.Length; //TODO: This has to be done lazily otherwise large arrays will take all the RAM
        if (!size || !length) {
            return; //TODO: log?
        }
        const elementSize = size / length;

        let children = [];
        for (let i = 0; i < length; i++) {
            const self = this;
            const valueProvider = new class implements RawValueProvider {
                async value(): Promise<Buffer | undefined> {
                    const value = await self.valueProvider.value();
                    const elementBytes = value?.subarray(i * elementSize, (i + 1) * elementSize);
                    return elementBytes;
                }
                isBigEndian(): boolean {
                    return self.valueProvider.isBigEndian();
                }
            }();

            const nameProvider = new class implements NameProvider {
                name() {
                    return `[${i}]`;
                }
            }();

            const v = this.helper.createVariable(baseTypeDetails, undefined, nameProvider, valueProvider); //TODO: do array elements even have symbols?

            if (v !== undefined) {
                children.push(v);
            }
        }
        this.children = children;
    }

    async displayValue(): Promise<string | undefined> {

        return "[...]"; //TODO: What should an array display for value? First N elements?
    }
}
