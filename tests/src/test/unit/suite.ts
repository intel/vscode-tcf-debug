/*
Copyright (C) 2023 Intel Corporation
SPDX-License-Identifier: MIT
*/
import { jsonSchemaTest } from "./jsonverify";

describe("Tests", function () {
    describe("JSON validators", jsonSchemaTest.bind(this));
});