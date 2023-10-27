/*
Copyright (C) 2022, 2023 Intel Corporation
SPDX-License-Identifier: MIT
*/
import { ValidatingCommand, asStringArray } from './tcfutils';

//see https://download.eclipse.org/tools/tcf/tcf-docs/TCF%20Service%20-%20Context%20Query.html#CmdQuery
export class QueryCommand extends ValidatingCommand<string[]> {
    query: string;

    constructor(q: string) {
        super();
        this.query = q;
    }

    debugDescription(tokenID: number): string {
        return `${this.service()}/${tokenID}` + "/" + this.command() + "/" + this.query;
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
