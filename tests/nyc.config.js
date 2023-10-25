/*
Copyright (C) 2023 Intel Corporation
SPDX-License-Identifier: MIT
*/
'use strict';
const path = require('path');

module.exports = {
    // "extends": "@istanbuljs/nyc-config-typescript",
    "cwd": path.resolve(__dirname, "../"),
    "all": true,
    // "check-coverage": true,
    "include": [
        "**/vscode-tcf-debug/**/*.js",
        "**/vscode-tcf-debug/**/*.ts",
    ],
    "exclude": [
        "**/test/**",
        "**/vscode-tcf-debug/node_modules/**",
        //Instambul doesn't seem to detect the validators usage properly (probably because they are pure JS and not TS files)
        "**/vscode-tcf-debug/**/validators/*",
    ],
    "excludeNodeModules": false
};