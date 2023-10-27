/*
Copyright (C) 2022, 2023 Intel Corporation
SPDX-License-Identifier: MIT
*/
import { ValidatingCommand, asString } from './tcfutils';

abstract class DiagnosticsCommand<T> extends ValidatingCommand<T> {
    constructor() {
        super();
    }

    debugDescription(tokenID: number): string {
        return `${this.service()}/${tokenID}`;
    }

    service(): string {
        return "Diagnostics";
    }
}

//see https://download.eclipse.org/tools/tcf/tcf-docs/TCF%20Service%20-%20Diagnostics.html#CmdEcho
export class EchoDiagnosticsCommand extends DiagnosticsCommand<string> {
    command(): string {
        return "echo";
    }

    arguments() {
        return "hello world"; //can be anything really
    }

    override cast(json: any): string {
        return asString(json);
    }
}