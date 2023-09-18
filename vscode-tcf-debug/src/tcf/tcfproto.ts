/*
Copyright (C) 2022, 2023 Intel Corporation
SPDX-License-Identifier: MIT
*/

export interface TCFCommand {
    token(): string;
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
