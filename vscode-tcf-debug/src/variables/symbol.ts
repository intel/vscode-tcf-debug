/*
Copyright (C) 2023 Intel Corporation
SPDX-License-Identifier: MIT
*/
import { GetChildrenMemoryCommand, GetMemoryCommand, MemoryResult, TCFSymbolContextData } from "../tcf-all";
import { RawValueProvider, VariableHelper } from "./types";

export const SYM_FLAG_BIG_ENDIAN = 0x00001000;
export const SYM_FLAG_ARTIFICIAL = 0x00020000;
export const SYM_FLAG_TYPEDEF = 0x00000002;
export const SYM_FLAG_TYPE_PARAMETER = 0x00040000;

export class SymbolRawValueProvider implements RawValueProvider {
    rawValue: Buffer | undefined = undefined;
    loaded = false;
    bigEndian: boolean = false; //any default as good?
    symbol: TCFSymbolContextData;
    helper: VariableHelper;
    context: string;

    constructor(symbol: TCFSymbolContextData, context: string, helper: VariableHelper) {
        this.symbol = symbol;
        this.helper = helper;
        this.context = context; //TODO: let's hope this context does something. delete if nhot
        if (symbol.Flags !== undefined) {
            this.bigEndian = (symbol.Flags & SYM_FLAG_BIG_ENDIAN) !== 0;
        }
    }

    //A horrible hack to read the memory by looking into *ALL* the context IDs.
    //TODO: find out which is the corresponding memory context ID for a given symbol? there must be some direct way.
    private async findMemory(memoryContextID: string | null): Promise<MemoryResult | undefined> {
        if (memoryContextID !== null && this.symbol.Address && this.symbol.Size) {
            try {
                const r: MemoryResult = await this.helper.sendCommand(new GetMemoryCommand(memoryContextID, this.symbol.Address, 1, this.symbol.Size));
                return r;
            } catch (e) {
                //ignore
            }
        }

        const children: string[] = await this.helper.sendCommand(new GetChildrenMemoryCommand(memoryContextID)) ?? [];
        for (const child of children) {
            const r = await this.findMemory(child);
            if (r !== undefined) {
                return r;
            }
        }

        return undefined;
    }

    private async loadValue() {
        if (this.symbol.Value) {
            this.rawValue = Buffer.from(Buffer.from(this.symbol.Value).toString(), "base64");
            return;
        }

        if (this.symbol.Address && this.symbol.Size) {
            try {
                const r: MemoryResult = await this.helper.sendCommand(new GetMemoryCommand(this.context, this.symbol.Address, 1, this.symbol.Size)); //TODO: what is the wordsize here? assuming 1 (probably wrongly)
                this.rawValue = Buffer.from(Buffer.from(r.base64).toString(), "base64");
            } catch (e) {
                console.log(e);
            }
        }
    }

    async value(): Promise<Buffer | undefined> {
        if (!this.loaded) {
            this.loaded = true;
            await this.loadValue();
        }
        return this.rawValue;
    }

    isBigEndian(): boolean {
        return this.bigEndian;
    }
}
