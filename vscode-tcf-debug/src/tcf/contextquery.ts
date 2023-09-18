/*
Copyright (C) 2022, 2023 Intel Corporation
SPDX-License-Identifier: MIT
*/
import { ValidatingCommand, asStringArray } from './tcfutils';

let tokenCounter = 0;

//see https://download.eclipse.org/tools/tcf/tcf-docs/TCF%20Service%20-%20Context%20Query.html#CmdQuery
export class QueryCommand extends ValidatingCommand<string[]> {
    query: string;

    constructor(q: string) {
        super(tokenCounter++);
        this.query = q;
    }

    token(): string {
        return `${this.service()}/${this.tokenID}` + "/" + this.command() + "/" + this.query;
    }

    service(): string {
        return "ContextQuery";
    }

    command(): string {
        return "query";
    }

    arguments() {
        return this.query;
    }

    override cast(json: any): string[] {
        return asStringArray(json);
    }
}
