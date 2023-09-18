/*
Copyright (C) 2023 Intel Corporation
SPDX-License-Identifier: MIT
*/
import { GetChildrenSymbolsCommand, GetContextSymbolsCommand, TCFSymbolContextData } from "../tcf-all";
import { AbstractVariable, ClientVariable, NameProvider, RawValueProvider, VariableHelper } from "./types";

export class CompositeVariable extends AbstractVariable {
    private children: ClientVariable[] | undefined = undefined;
    helper: VariableHelper;

    _displayValue: string | undefined;
    loadedValue: boolean = false;
    symbol: TCFSymbolContextData;

    constructor(type: TCFSymbolContextData, symbolDetails: TCFSymbolContextData, helper: VariableHelper, nameProvider: NameProvider, valueProvider: RawValueProvider) {
        super(type, symbolDetails, nameProvider, valueProvider);
        this.symbol = symbolDetails;
        this.helper = helper;
    }

    async getChildren(): Promise<ClientVariable[]> {
        if (this.children === undefined) {
            await this.loadChildren();
        }
        return this.children ?? [];
    }

    async loadChildren() {
        //NOTE: In theory we could get the struct fields via GetChildrenExpressionCommand but it doesn't seem to work with any argument...
        const structFields = await this.helper.sendCommand(new GetChildrenSymbolsCommand(this.symbol.ID)) || []; //or value.properties.Symbol?
        let children = [];

        for (const structField of structFields) {
            const fieldContext = await this.helper.sendCommand(new GetContextSymbolsCommand(structField));
            let typeContext: TCFSymbolContextData | undefined = undefined;

            if (fieldContext.TypeID) {
                try {
                    typeContext = await this.helper.sendCommand(new GetContextSymbolsCommand(fieldContext.TypeID));
                } catch (e) {
                    console.error(`Could not load struct field type: ${e}`);
                    //XXX: normally we should have a type, but let's allow an undefined and handle it futher down
                }
            }

            if (!typeContext) {
                //TODO: This should not be allowed... but older tests do need it since this was the initial (wrong) behavior
                //TODO: Rewrite test (and particularly re-record pcap) for the broken test
                console.log("Struct field has no (loadable) type. Reusing parent struct type.");
                typeContext = fieldContext;
                //continue;
            }

            const self = this;
            const valueProvider = new class implements RawValueProvider {
                async value(): Promise<Buffer | undefined> {
                    if (fieldContext.Offset === undefined || fieldContext.Size === undefined) {
                        //TODO: also fallback to name being the index?
                        return undefined;
                    }
                    const value = await self.valueProvider.value();
                    const elementBytes = value?.subarray(fieldContext.Offset, fieldContext.Offset + fieldContext.Size);
                    return elementBytes;
                }
                isBigEndian(): boolean {
                    return self.valueProvider.isBigEndian();
                }
            }();

            const nameProvider = new class implements NameProvider {
                name(): string | undefined {
                    //TODO: name could be index c.type.Name || `${variableName}[${i}]`
                    return fieldContext.Name ?? typeContext?.Name ?? undefined;
                }

            }();

            //fieldContext is a symbol data structure, not a type data structure...
            const v = this.helper.createVariable(typeContext, fieldContext, nameProvider, valueProvider);
            if (v !== undefined && nameProvider.name() !== undefined) {
                children.push(v);
            }

            console.log(`Field ${JSON.stringify(fieldContext)}`);
        }

        this.children = children;
    }

    async displayValue(): Promise<string | undefined> {
        if (!this.loadedValue) {
            this.loadedValue = true;
            this._displayValue = await this.loadValue();
        }
        return this._displayValue;
    }

    async loadValue(): Promise<string | undefined> {
        let structChildren = await this.getChildren();

        let chunks = [];
        //load first 3 fields into struct display value
        for (let i = 0; i < Math.min(3, structChildren.length); i++) {
            chunks.push(`[${structChildren[i].name()}]`);
            chunks.push("=");

            chunks.push(await structChildren[i].displayValue()); //TODO: this could recurse very deeply or even infinitely!
        }
        return chunks.join(" ");
    }

}
