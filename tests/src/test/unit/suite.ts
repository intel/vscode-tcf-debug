/*
Copyright (C) 2023 Intel Corporation
SPDX-License-Identifier: MIT
*/
import { badServiceSuite } from "./badservice";
import { jsonSchemaTest } from "./jsonverify";
import { tokenMismatchSuite } from "./tokenmismatch";
import { tokenStyleSuite } from "./tokenstyle";

describe("Tests", function () {
    describe("JSON validators", jsonSchemaTest.bind(this));
    describe("Mismatch", tokenMismatchSuite.bind(this));
    describe("Token style", tokenStyleSuite.bind(this));
    describe("Unsupported service", badServiceSuite.bind(this));
});