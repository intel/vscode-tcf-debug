/*
Copyright (C) 2022, 2023 Intel Corporation
SPDX-License-Identifier: MIT
*/
import { SimpleCommand, SimpleEvent } from './tcfutils';

let tokenCounter = 0;

abstract class LocatorCommand<T> extends SimpleCommand<T> {
    constructor() {
        super(tokenCounter++);
    }

    service(): string {
        return "Locator";
    }

    token(): string {
        return `${this.service()}/${this.tokenID}`;
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