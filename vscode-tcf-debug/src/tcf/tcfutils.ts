/*
Copyright (C) 2022, 2023 Intel Corporation
SPDX-License-Identifier: MIT
*/
import { TCFError, asTCFError } from './error';
import { TCFCommand, TCFEvent } from './tcfproto';

/**
 * 
 * @param n 
 * @param buffers 
 * @returns true if there are n buffers *or* n+1 buffers but the last one has size 0.
 */
export function responseLengthAbout(n: number, buffers: Buffer[]): boolean {
    return (buffers.length === n || (buffers.length === (n + 1) && buffers[buffers.length - 1].length === 0));
}

export function toBuffer(words: string[], arg?: any | undefined, forceNullArg?: boolean): Buffer {
    const separator = Buffer.from([0]);

    let buffers: Buffer[] = [];
    let first = true;
    for (const word of words) {
        if (!first) {
            buffers.push(separator);
        }
        buffers.push(Buffer.from(word));
        first = false;
    }

    if (arg || forceNullArg) {
        buffers.push(separator);
        buffers.push(Buffer.from(JSON.stringify(arg)));
    }
    buffers.push(separator);
    buffers.push(Buffer.from([3, 1]));

    return Buffer.concat(buffers);
}

export function split(b: Buffer, separator: Uint8Array = Uint8Array.from([0])): Buffer[] {
    let buffers: Buffer[] = [];
    while (true) {
        const zero = b.indexOf(separator);
        if (zero !== -1) {
            buffers.push(b.subarray(0, zero));
            b = b.subarray(zero + 1);
        } else {
            buffers.push(b);
            break;
        }
    }

    return buffers;
}

export function join(b: Buffer[], separator: Buffer = Buffer.from([0])): Buffer {
    if (b.length === 0) {
        return Buffer.from([]);
    }

    let all = [b[0]];
    for (let i = 1; i < b.length; i++) {
        all.push(separator);
        all.push(b[i]);
    }
    return Buffer.concat(all);
}

//split buffer on '0'-byte separator
export function splitBuffer(b: Buffer, count: number): Buffer[] {
    if (count <= 1) { //TODO: or fail on negatives, etc.
        return [b];
    }

    let buffers: Buffer[] = [];
    for (let i = 0; i < count; i++) {
        const zero = b.indexOf(0);
        if (zero === -1) {
            throw new Error("Bad buffer. No separator for index " + i);
        }
        buffers.push(b.subarray(0, zero));
        b = b.subarray(zero + 1);
    }

    const finalZero = b.indexOf(0); // b.indexOf(Uint8Array.from([3, 1])); 
    if (finalZero !== -1) {
        //normally, this would be at the end of the buffer
        if (finalZero !== b.length - 1) {
            console.log("Another zero at index " + finalZero + " for buffer of size " + b.length + " " + b.subarray(finalZero + 1).toString());
        }
        buffers.push(b.subarray(0, finalZero));
        //TODO: what about the remaining?
    } else {
        buffers.push(b);
    }

    return buffers;
}

export class TCFPartialResultError<T> extends Error {

    public result: T;

    constructor(error: TCFError | SyntaxError, result: T) {
        super('Partial result', {
            cause: error
        });
        this.result = result;
    }

}

export class JSONValidationError<T> extends Error {

    public result: T;

    constructor(error: any, result: T) {
        super('JSON validation error', {
            cause: error
        });
        this.result = result;
    }

}

export type PromiseSuccess<T> = (v: T) => void;
export type PromiseError<T> = (v: TCFError | SyntaxError | TCFPartialResultError<T> | JSONValidationError<T>) => void;

export type Validator = (json: any) => boolean;
export type RuntimeCaster<T> = (json: any) => T;

export abstract class SimpleCommand<T> implements TCFCommand {

    constructor() {
    }

    abstract debugDescription(tokenID: number): string;
    abstract service(): string;
    abstract command(): string;
    abstract arguments(): any;

    toBuffer(token: string): Buffer {
        return toBuffer(["C", token, this.service(), this.command()], this.arguments());
    }

    resultPromise(responseAll: Buffer[]): Promise<T> {
        return new Promise((success, failure) => {
            this.result(responseAll, success, failure);
        });
    }

    abstract result(responseAll: Buffer[], success: PromiseSuccess<T>, error: PromiseError<T>): void;
}

export abstract class ValidatingCommand<T> extends SimpleCommand<T> {

    abstract cast(json: any): T;

    override result(responseAll: Buffer[], success: PromiseSuccess<T>, error: PromiseError<T>): void {
        parseResponse(responseAll, success, error, this.cast.bind(this));
    }
}

/**
 * 
 * @param resultError TCF error buffer
 * @param error error handler
 * @returns true if error was handled, false if there was no error
 */
export function handleErrorBuffer(resultError: Buffer, error: PromiseError<TCFError | SyntaxError>): boolean {
    if (resultError?.length > 0) {
        try {
            const json = JSON.parse(resultError.toString()); //validated below
            if (json === null) {
                return false; // null NOT an error
            }
            const err = asTCFError(json); //may throw, handled by catch
            error(err);
        } catch (e) {
            handleError(e, error);
        }
        return true;
    } else {
        return false;
    }
}

export function handleError<T>(e: any, error: PromiseError<T>) {
    if (e instanceof SyntaxError) {
        error(e);
    } else if (e instanceof TCFPartialResultError) {
        error(e);
    } else if (e instanceof JSONValidationError) {
        error(e);
    } else {
        error(new SyntaxError("" + e));
    }
}

//parse a response that can only have an error
export function parseEmptyResponse(responseAll: Buffer[], success: PromiseSuccess<undefined>, error: PromiseError<undefined>): void {
    const [resultError, ...response] = responseAll;

    if (handleErrorBuffer(resultError, error)) {
        return;
    }

    if (!responseLengthAbout(0, response)) {
        error(new SyntaxError(`Response should have no JSON, got ${response.length} buffers`));
        return;
    }

    success(undefined);
}

export function parseResponse<T>(responseAll: Buffer[], success: PromiseSuccess<T>, error: PromiseError<T>, caster: RuntimeCaster<T>): void {

    const [resultError, ...response] = responseAll;

    if (handleErrorBuffer(resultError, error)) {
        return;
    }

    if (!responseLengthAbout(1, response)) {
        error(new SyntaxError(`Response should have a single JSON, got ${response.length} buffers`));
        return;
    }

    try {
        const json = JSON.parse(response[0].toString());
        success(caster(json));
    } catch (e) {
        handleError(e, error);
    }
}

export abstract class SimpleEvent implements TCFEvent {
    abstract service(): string;
    abstract event(): string;
    abstract data(): any;

    toBuffer(): Buffer {
        return toBuffer(["E", this.service(), this.event()], this.data());
    }
}

export type CancellationFunction = () => boolean;

export const NEVER_CANCELLED: CancellationFunction = () => false;

export class InterruptedError extends Error {
    constructor(message?: string) {
        super(message);
    }
}

export class TimeoutError extends Error {
    constructor(message?: string) {
        super(message);
    }
}

export function validateJSON(result: any, validator: Validator): any {
    const validResult = validator(result);
    if (!validResult) {
        const validationErrors = (validator as any).errors;
        throw new JSONValidationError(validationErrors, result);
    }
    return result;
}

export function asNullable<T>(json: any, caster: RuntimeCaster<T>): T | null {
    if (json === null) {
        return null;
    }
    return caster(json);
}

export function asString(json: any): string {
    if (typeof json === 'string') {
        return json as string; //type assertion OK
    }
    throw new JSONValidationError("Not a string", json);
}

export function asNullableString(json: any): string | null {
    return asNullable(json, asString);
}

export function asStringNullableArray(result: any) {
    return asNullableArray(result, asString);
}

export function asStringArray(result: any) {
    return asArray(result, asString);
}

export function asArray<T>(result: any, itemCaster: RuntimeCaster<T>): T[] {
    if (!(result && typeof result === "object" && Array.isArray(result))) {
        throw new JSONValidationError("Not an array", result);
    }
    const items = result as any[]; //type assertion OK
    for (const item of items) {
        const k = itemCaster(item); //This may also throw a validation error
        if (k !== item) {
            //NOTE that this is a type cast and *not* object conversion!
            throw new JSONValidationError("Item converted during runtime validation and cast", result);
        }
    }
    return result as T[]; //type asssertion OK
}

export function asNullableArray<T>(result: any, itemCaster: RuntimeCaster<T>): T[] | null {
    if (result === null) {
        return null;
    }
    return asArray(result, itemCaster);
}
