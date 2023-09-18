/*
Copyright (C) 2023 Intel Corporation
SPDX-License-Identifier: MIT
*/

export interface VariableInfo {
    children?: VariableInfo[];
    value?: string;
    name: string;
}
