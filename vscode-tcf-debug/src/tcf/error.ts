/*
Copyright (C) 2022, 2023 Intel Corporation
SPDX-License-Identifier: MIT
*/
import * as validateTCFError from './validators/validate-TCFError';

//see https://download.eclipse.org/tools/tcf/tcf-docs/TCF%20Error%20Report%20Format.html
/* eslint-disable @typescript-eslint/naming-convention */
export interface TCFError {
    Code: number,
    Time?: number,
    Service?: string,
    Format?: string,
    Params?: any[],
    Severity?: number,
    AltCode?: number,
    AltOrg?: string,
    CausedBy?: TCFError
}
/* esline-enable */

export function asTCFError(result: any): TCFError {
    const validResult = validateTCFError(result);
    if (!validResult) {
        //this one is pretty odd... the error itself not validating?
        //still, it's not a good JSON
        throw new SyntaxError("JSON did not validate");
    }
    return result as TCFError; //type assertion OK
}

/* eslint-disable @typescript-eslint/naming-convention */
export enum TCFErrorCodes {
    OTHER = 1,
    JSON_SYNTAX,
    PROTOCOL,
    BUFFER_OVERFLOW,
    CHANNEL_CLOSED,
    COMMAND_CANCELLED,
    UNKNOWN_PEER,
    BASE64,
    EOF,
    ALREADY_STOPPED,
    ALREADY_EXITED,
    ALREADY_RUNNING,
    ALREADY_ATTACHED,
    IS_RUNNING,
    INV_DATA_SIZE,
    INV_CONTEXT,
    INV_ADDRESS,
    INV_EXPRESSION,
    INV_FORMAT,
    INV_NUMBER,
    INV_DWARF,
    SYM_NOT_FOUND,
    UNSUPPORTED,
    INV_DATA_TYPE,
    INV_COMMAND,
}
/* eslint-enable */