/*
Copyright (C) 2022, 2023 Intel Corporation
SPDX-License-Identifier: MIT
*/
import { SimpleCommand, SimpleEvent } from './tcfutils';

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
    event(): string {
        return "Hello";
    }

    data() {
        return ["Locator"]; //list of our services. we barely know... locator!
    }
}