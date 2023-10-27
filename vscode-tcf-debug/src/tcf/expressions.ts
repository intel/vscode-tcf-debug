/*
Copyright (C) 2022, 2023 Intel Corporation
SPDX-License-Identifier: MIT
*/
import { TCFError } from './error';
import { TCFSymbolClass } from './symbols';
import { asNullable, asString, asStringArray, handleError, handleErrorBuffer, PromiseError, PromiseSuccess, responseLengthAbout, SimpleCommand, TCFPartialResultError, toBuffer, validateJSON, ValidatingCommand } from './tcfutils';
import * as validateValueProperties from './validators/validate-ValueProperties';
import * as validateExpressionsContextData from './validators/validate-ExpressionsContextData';

abstract class ExpressionsCommand<T> extends SimpleCommand<T> {
    constructor() {
        super();
    }

    service(): string {
        return "Expressions";
    }

    debugDescription(tokenID: number): string {
        return `${this.service()}/${tokenID}`;
    }

}

abstract class ExpressionsValidatingCommand<T> extends ValidatingCommand<T> {
    constructor() {
        super();
    }

    service(): string {
        return "Expressions";
    }

    debugDescription(tokenID: number): string {
        return `${this.service()}/${tokenID}`;
    }

}

//see https://download.eclipse.org/tools/tcf/tcf-docs/TCF%20Service%20-%20Expressions.html#CmdGetChildren
export class GetChildrenExpressionCommand extends ExpressionsValidatingCommand<string[]> {
    parentContextID: string;

    constructor(parentContextID: string) {
        super();
        this.parentContextID = parentContextID;
    }

    debugDescription(tokenID: number): string {
        return super.debugDescription(tokenID) + "/" + this.command() + "/" + this.arguments();
    }

    command(): string {
        return "getChildren";
    }

    arguments() {
        return this.parentContextID;
    }

    override cast(json: any): string[] {
        return asStringArray(json);
    }
}

/* eslint-disable @typescript-eslint/naming-convention */
export interface EvaluateResult {
    value: Buffer,//bytes
    properties: ValueProperties | null,
}

export type base64Text = string;

//Observed in the wild. NOT in spec.
export interface PieceValue {
    Size: number,
    Value?: base64Text //base64 encoded value
}

export interface ValueProperties {
    Class?: TCFSymbolClass,
    Type?: string,
    Symbol?: string,
    BitStride?: number,
    BinaryScale?: number,
    DecimalScale?: number,
    ImplicitPointer?: boolean,
    Register?: string,
    Address?: number,
    Pieces?: PieceValue[],//TBD in spec?!
    BigEndian?: boolean
}
/* eslint-enable */

export function asNullableValueProperties(result: any): ValueProperties | null {
    if (result === null) {
        return null;
    }
    return validateJSON(result, validateValueProperties) as ValueProperties; //type assertion OK
}

//see https://download.eclipse.org/tools/tcf/tcf-docs/TCF%20Service%20-%20Expressions.html#CmdEvaluate
export class EvaluateExpressionsCommand extends ExpressionsCommand<EvaluateResult> {
    expressionID: string;

    constructor(expressionID: string) {
        super();
        this.expressionID = expressionID;
    }

    debugDescription(tokenID: number): string {
        return super.debugDescription(tokenID) + "/" + this.command() + "/" + this.arguments();
    }

    command(): string {
        return "evaluate";
    }

    arguments() {
        return this.expressionID;
    }

    result(responseAll: Buffer[], success: PromiseSuccess<EvaluateResult>, error: PromiseError<EvaluateResult>): void {
        parseEvaluateResult(responseAll, success, error);
    }
}

function parseEvaluateResult(responseAll: Buffer[], success: PromiseSuccess<EvaluateResult>, error: PromiseError<EvaluateResult>): void {
    const [value, resultError, ...properties] = responseAll;

    //evaluate errors are interesting since they can also give partial results.
    //so, let's first save the error, if any.
    let savedError: TCFError | SyntaxError | undefined = undefined;
    handleErrorBuffer(resultError, (v => savedError = v));

    //we tolerate a final empty buffer at the end
    if (!responseLengthAbout(1, properties)) {
        console.log(`Expressions.evaluate response should have a single JSON, got ${properties.length} buffers`);
    }

    try {
        //error for invalid JSON will be caught further down and handled
        const result = {
            value,
            properties: asNullableValueProperties(JSON.parse(properties[0].toString()))
        } as EvaluateResult;

        if (!savedError) {
            success(result);
        } else {
            //let's see if this result is worth considering
            if (!result || Object.keys(result).length === 0) {
                //empty result, let's just call it a plain error
                error(savedError);
            } else {
                // a (partial?) result *and* an error
                error(new TCFPartialResultError(savedError, result));
            }
        }
    } catch (e) {
        if (savedError) {
            //XXX: Is the 2nd error 'e' relevant anymore? I think not.
            handleError(savedError, error);
        } else {
            handleError(e, error);
        }
    }
}

//see https://download.eclipse.org/tools/tcf/tcf-docs/TCF%20Service%20-%20Expressions.html#CmdCreate
export class CreateExpressionsCommand extends ExpressionsValidatingCommand<string> {
    parentContextID: string;
    language: string | null;
    expression: string;

    constructor(parentContextID: string, language: string | null, expression: string) {
        super();
        this.parentContextID = parentContextID;
        this.language = language;
        this.expression = expression;
    }

    debugDescription(tokenID: number): string {
        return super.debugDescription(tokenID) + "/" + this.command() + "/" + this.parentContextID + "/" + this.expression;
    }

    command(): string {
        return "create";
    }

    arguments() {
        return undefined;
    }

    toBuffer(token: string): Buffer {
        return toBuffer(["C", token, this.service(), this.command(),
            JSON.stringify(this.parentContextID), JSON.stringify(this.language), JSON.stringify(this.expression)],
            this.arguments());
    }

    override cast(json: any): string {
        return asString(json);
    }
}

//see https://download.eclipse.org/tools/tcf/tcf-docs/TCF%20Service%20-%20Expressions.html#CmdCreateInScope
export class CreateExpressionInScopeCommand extends ExpressionsValidatingCommand<string> {
    scope: string;
    expression: string;

    constructor(scope: string, expression: string) {
        super();
        this.scope = scope;
        this.expression = expression;
    }

    debugDescription(tokenID: number): string {
        return super.debugDescription(tokenID) + "/" + this.command() + "/" + this.scope + "/" + this.expression;
    }

    command(): string {
        return "createInScope";
    }
    arguments() {
        return undefined;
    }

    toBuffer(token: string): Buffer {
        return toBuffer(["C", token, this.service(), this.command(),
            JSON.stringify(this.scope), JSON.stringify(this.expression)]);
    }

    override cast(json: any): string {
        return asString(json);
    }
}

// see https://download.eclipse.org/tools/tcf/tcf-docs/TCF%20Service%20-%20Expressions.html#CmdGetContext
// TODO: Should be cached by clients
/* eslint-disable @typescript-eslint/naming-convention */
interface ExpressionsContextData {
    ID: string,
    ParentID?: string,
    SymbolID?: string,
    Expression?: string,
    CanAssign?: boolean,
    HasFuncCall?: boolean,
    Class?: number,
    Type?: string,
    Size?: number
}
/* eslint-enable */

export function asExpressionsContextData(result: any): ExpressionsContextData {
    return validateJSON(result, validateExpressionsContextData) as ExpressionsContextData; //type assertion OK
}

//see https://download.eclipse.org/tools/tcf/tcf-docs/TCF%20Service%20-%20Expressions.html#CmdGetContext
export class GetContextExpressionsCommand extends ExpressionsValidatingCommand<ExpressionsContextData | null> {
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

    override cast(json: any) {
        return asNullable(json, asExpressionsContextData);
    }

}