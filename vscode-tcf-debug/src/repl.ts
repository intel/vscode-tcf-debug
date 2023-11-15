/*
Copyright (C) 2023 Intel Corporation
SPDX-License-Identifier: MIT
*/
import { DebugProtocol } from "@vscode/debugprotocol";
import { TCFClient } from "./tcfclient";
import { TCFLogger } from "./tcf";

export interface Repl {
    evaluateRequest(response: DebugProtocol.EvaluateResponse, args: DebugProtocol.EvaluateArguments, request?: DebugProtocol.Request | undefined): Promise<void>;
    handledEvent(service: string, event: string, datas: Buffer[]): boolean;
    disconnect(): void;
}

export interface ReplProvider {
    create(client: TCFClient, logger: TCFLogger): Repl;
}