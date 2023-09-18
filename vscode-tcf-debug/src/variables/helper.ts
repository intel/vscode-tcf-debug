/*
Copyright (C) 2023 Intel Corporation
SPDX-License-Identifier: MIT
*/
import { SimpleCommand, TCFSymbolClass, TCFSymbolContextData, TCFTypeClass } from "../tcf-all";
import { ArrayVariable } from "./array";
import { CompositeVariable } from "./composite";
import { PointerVariable } from "./pointer";
import { PrimitiveVariable } from "./primitive";
import { RawVariable } from "./raw";
import { SYM_FLAG_TYPEDEF, SYM_FLAG_TYPE_PARAMETER } from "./symbol";
import { ClientVariable, NameProvider, RawValueProvider, VariableHelper } from "./types";

export abstract class DefaultVariableHelper implements VariableHelper {
    abstract sendCommand<T>(c: SimpleCommand<T>): Promise<T>;

    createVariable(typeDetails: TCFSymbolContextData, symbolDetails: TCFSymbolContextData | undefined, nameProvider: NameProvider, valueProvider: RawValueProvider): ClientVariable | undefined {
        if (this.shouldFilter(typeDetails, symbolDetails)) {
            return undefined;
        }

        switch (typeDetails.TypeClass) {
            case TCFTypeClass.integer:
            case TCFTypeClass.cardinal:
            case TCFTypeClass.real:
                return new PrimitiveVariable(typeDetails, symbolDetails, nameProvider, valueProvider);
            case TCFTypeClass.pointer:
                return new PointerVariable(typeDetails, symbolDetails, nameProvider, valueProvider, this);
            case TCFTypeClass.composite:
                if (symbolDetails) {
                    return new CompositeVariable(typeDetails, symbolDetails, this, nameProvider, valueProvider);
                } else {
                    return undefined;
                }
            case TCFTypeClass.array:
                return new ArrayVariable(typeDetails, this, nameProvider, valueProvider);
            case TCFTypeClass.enumeration:
            case TCFTypeClass.function:
                console.log(`Function/enum variable ${JSON.stringify(typeDetails)} ${JSON.stringify(symbolDetails)}`);
                return undefined;
            default:
                return new RawVariable(typeDetails, symbolDetails, [], nameProvider, valueProvider);
        }
    }

    private shouldFilter(typeDetails: TCFSymbolContextData, symbolDetails: TCFSymbolContextData | undefined): boolean {
        if (symbolDetails) {
            switch (symbolDetails.Class) {
                case TCFSymbolClass.value:
                case TCFSymbolClass.reference:
                    //what we expect
                    break;
                case TCFSymbolClass.type:
                case TCFSymbolClass.block:
                case TCFSymbolClass.comp_unit:
                case TCFSymbolClass.function:
                case TCFSymbolClass.namespace:
                    //a type symbol isn't a very practical variable to display, so we don't
                    return true;
                default:
                    break;
            }
        }

        return false;
    }
}
