/*
Copyright (C) 2023 Intel Corporation
SPDX-License-Identifier: MIT
*/
import assert = require("assert");
import { asTCFContextData } from "vscode-tcf-debug/out/tcf-all";
import * as validateTCFContextData from 'vscode-tcf-debug/out/tcf/validators/validate-TCFContextData.js';

export function jsonSchemaTest() {
    it('Should propagate validator error', function () {

        const badObject = {
            /* eslint-disable @typescript-eslint/naming-convention */
            ID: "10",
            ParentID: 42 //should be string
            /* eslint-enable */
        };

        //validate manually
        const valid = validateTCFContextData(badObject);
        assert.equal(false, valid);
        const errors = (validateTCFContextData as any).errors;

        assert.notEqual(undefined, errors, "Errors should exists");

        //validate with the helper as- function
        try {
            asTCFContextData(badObject);
            assert.fail("Should not get this far");
        } catch (e) {
            //expected to get an error
            const cause = (e as Error).cause;

            assert.notEqual(undefined, cause, "Validation cause should be propagated");
            assert.deepEqual(errors, cause, "The same validation error should be wrapped in the JSON validation error");
        }
    });
}
