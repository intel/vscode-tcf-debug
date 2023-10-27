/*
Copyright (C) 2022, 2023 Intel Corporation
SPDX-License-Identifier: MIT
*/

/**
 * Note that normally a TCF command has a `token` too. That token is not part of the command though,
 * it is just a serialization identifier. As such it is excluded from this interface. This may not
 * be the best idea if we add command de-serialization since the token will have to be represented
 * somehow.
 */
export interface TCFCommand {
    service(): string;
    command(): string;
    arguments(): any;
}

export interface TCFResult {
    token(): string;
    data(): any;
}

export interface TCFEvent {
    service(): string;
    event(): string;
    data(): any;
}

export interface TCFFlowControl {
    congestion(): number;
}
