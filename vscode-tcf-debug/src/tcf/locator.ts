/*
Copyright (C) 2022, 2023 Intel Corporation
SPDX-License-Identifier: MIT
*/
import { SimpleCommand, SimpleEvent, asStringNullableArray, responseLengthAbout } from './tcfutils';

abstract class LocatorCommand<T> extends SimpleCommand<T> {
    constructor() {
        super();
    }

    service(): string {
        return "Locator";
    }

    debugDescription(tokenID: number): string {
        return `${this.service()}/${tokenID}`;
    }

}

abstract class LocatorEvent extends SimpleEvent {
    service(): string {
        return "Locator";
    }
}

//see https://download.eclipse.org/tools/tcf/tcf-docs/TCF%20Service%20-%20Locator.html
export class HelloLocatorEvent extends LocatorEvent {

    services: string[];

    constructor(services: string[] = ["Locator"]) { //list of our services. we barely know... locator!
        super();
        this.services = services;
    }

    event(): string {
        return "Hello";
    }

    data() {
        return this.services;
    }
}

export function parseHelloLocatorEvent(response: Buffer[]): string[] | null {
    if (!responseLengthAbout(1, response)) {
        throw new SyntaxError(`Response should have one JSON array, got ${response.length} buffers`);
    }

    const supportedServices = asStringNullableArray(JSON.parse(response[0].toString())); //may throw validation error
    return supportedServices;
}