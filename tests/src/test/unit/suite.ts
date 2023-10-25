/*
Copyright (C) 2023 Intel Corporation
SPDX-License-Identifier: MIT
*/
import { jsonSchemaTest } from "./jsonverify";
import { tokenMismatchSuite } from "./tokenmismatch";

describe("Tests", function () {
    describe("JSON validators", jsonSchemaTest.bind(this));
    describe("Mismatch", tokenMismatchSuite.bind(this));
});