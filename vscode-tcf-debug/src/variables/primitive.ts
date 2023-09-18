/*
Copyright (C) 2023 Intel Corporation
SPDX-License-Identifier: MIT
*/
import { TCFSymbolContextData, TCFTypeClass } from "../tcf-all";
import { AbstractVariable, ClientVariable, NameProvider, RawValueProvider } from "./types";

export class PrimitiveVariable extends AbstractVariable {

    constructor(type: TCFSymbolContextData, symbolDetails: TCFSymbolContextData | undefined, nameProvider: NameProvider, valueProvider: RawValueProvider) {
        super(type, symbolDetails, nameProvider, valueProvider);
    }

    async getChildren(): Promise<ClientVariable[]> {
        return [];
    }

    async displayValue(): Promise<string | undefined> {
        const variableRawValue = await this.valueProvider.value();
        if (!variableRawValue) {
            return undefined;
        }
        let bigEndian = this.valueProvider.isBigEndian();

        switch (this.type.TypeClass) {
            case TCFTypeClass.integer: // SIGNED integer
                switch (variableRawValue.length) {
                    //TODO: how many bytes does an int have?! Let's hope 32 bit or 16bit
                    case 8: //64bit
                        const variable64Value = bigEndian ? variableRawValue.readBigInt64BE() : variableRawValue.readBigInt64LE();

                        return String(variable64Value);
                    case 4: //32bit
                        const variable32Value = bigEndian ? variableRawValue.readInt32BE() : variableRawValue.readInt32LE();

                        return String(variable32Value);
                    case 2: //16 bit
                        const variable16Value = bigEndian ? variableRawValue.readInt16BE() : variableRawValue.readInt16LE();

                        return String(variable16Value);
                    default:
                        console.log(`Could not parse integer variable value for variable ${this.name()}. Expected 2, 4 or 8 bytes, found ${variableRawValue.length} bytes`);
                        return undefined;
                }
            case TCFTypeClass.cardinal: // UNSIGNED integer
                switch (variableRawValue.length) {
                    case 8: //64bit
                        const variable64Value = bigEndian ? variableRawValue.readBigUInt64BE() : variableRawValue.readBigUInt64LE();

                        return String(variable64Value);
                    case 4: //32bit
                        const variable32Value = bigEndian ? variableRawValue.readUInt32BE() : variableRawValue.readUInt32LE();

                        return String(variable32Value);
                    case 2: //16 bit
                        const variable16Value = bigEndian ? variableRawValue.readUInt16BE() : variableRawValue.readUInt16LE();

                        return String(variable16Value);
                    default:
                        console.log(`Could not parse unsigned integer variable value for variable ${this.name()}. Expected 2, 4 or 8 bytes, found ${variableRawValue.length} bytes`);
                        return undefined;
                }
            case TCFTypeClass.real:
                switch (variableRawValue.length) {
                    case 8: //64 bit
                        const doubleValue = bigEndian ? variableRawValue.readDoubleBE() : variableRawValue.readDoubleLE();

                        return String(doubleValue);
                    case 4: //32bit
                        const floatValue = bigEndian ? variableRawValue.readFloatBE() : variableRawValue.readFloatLE();

                        return String(floatValue);
                    default:
                        console.log(`Could not parse float/double variable value for variable ${this.name()}. Expected 4 or 8 bytes, found ${variableRawValue.length} bytes`);
                        return undefined;
                }
            default:
                console.log(`Could not parse unknown primitive variable value for variable ${this.name()}, type class ${this.type.TypeClass}`);
                return undefined;
        }

    }
}

