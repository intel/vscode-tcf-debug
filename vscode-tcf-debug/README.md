# Visual Studio Code Target Communication Framework (TCF) Debugger Extension

This extension allows debugging via Target Communication Framework (TCF) from Visual Studio Code.

Manage breakpoints, resume after breakpoint hit, see the call stack and variables.

## Requirements

No dependencies. The extension only requires Visual Studio Code.

Read the full [manual](./docs/manual.md) or just follow the steps below.

## Installation

Download and install the `.VSIX` file. (Note that if you download a `.tgz` file the
`.vsix` is probably inside the `.tgz` archive).

```
    File Edit Selection View Go Run Terminal Help
-────────────────────────────
 📃    Extensions   ↻ [···]  ⬅️ 1. Press here
 🔎                      ┌────────────────────────────┐
 🐞                      │Views                       │
|🧩                      │Check for Extension Updates │
 ⚙️                      ├────────────────────────────┤
 📺                      │Install from VSIX...        │ ⬅️2. Then here
 🏁                      └────────────────────────────┘

```

## Configuration

A configuration of type `tcf` will auto-complete when you edit `launch.json`.

Note that the extension will connect to the TCF port so the debugged application must already be running (locally or remote) and the TCF port must be accessible. In practice you will have a local debugger running so you always connect to the local debugger TCF agent,
ie. to `localhost`.

Your local `launch.json` should work with the plain `tcf` configuration which connects by default to `localhost`:

```JSON
"configurations": [
        {
            "type": "tcf",
            "request": "launch",
            "name": "Debug program"
        }
    ]
```

but you can also manually configure the following parameters (default values shown):


```
{
  "host": "127.0.0.1", // or any other hostname you want to connect to
  "port": 1534,  //or any other port where a TCF agent is listening

  "record": undefined, // use any file path here to write a log of all the TCF messages (useful for bug reports and playback)
  "playback": undefined, //use a pre-existing TCF recording to simulate a debugging session (this is obviously brittle and requires you to run close to the same commands)

  "timeout": 10000 //debug commands timeout in milliseconds (this may be useful for connection to very slow machines)

  "debugTCFMessages": false //toggle to true to see in the debug console the TCF messages being sent / received (for internal use generally)

  "type": "tcf",
  "request": "launch",
  "name": "Debug program"
}
```

## Release Notes

### 0.2.8

* Fix source file not found when TCFCodeAreaLineNumbers.File has absolute path
* Maintenance

### 0.2.7

* Shows CPU registers in the `Registers` scope.
  Note that previously local variables *stored* in registers were
  showed in that scope. Now CPU registers are showed while
  all local variables are grouped together. The local variables
  stored in registers have a different presentation hint which
  VSCode may use to show them slightly differently.
* Supports instruction level granularity in step over.
* Loads fewer stack trace items based on the optional `stackTraceDepth` launch config.
  This massively reduces the number of messages (and time) it takes to load a stack trace
  with the disadvantage of loading only part of it.
  This disadvantage will be fixed in the future once `supportsDelayedStackTraceLoading` is
  implemented.

### 0.2.6
* Adds generic dynamic import service loader 
* Fallback to RunControl if ContextQuery is unavailable during initial handshake 
* Refactors toBuffer, introduces some constants and cleans up invocations 

### 0.2.5
* Print an error to the user if a mismatched reply is sent by a non-compliant tcf agent
* Improvements to our unit tests structure and added code coverage

### 0.2.4

* Adds disassembly support for stack trace
* Slightly faster stack trace loading (if CodeArea is present in stack context)

### 0.2.3

* Validates all TCF responses in order to be complaint with TCF specs
* Fixes watch variable functionality when frameId is 0
* Maintenance

### 0.2.2

* Adds `watch` functionality for local variables
* Validates all forms of input
* Validates all JSONs sent by the TCF agent

### 0.2.1

* Shows only relevant sub-variables for C++ class instance variables
* Shows breakpoint verified state
* Adds configuration to disable executing the path mapper function
* Shows hints in debug console during TCF playback to avoid confusing the run with an actual execution
* Adds basic update check. No update is actually done, just a message shown if different version found

### 0.2.0

* Step Over, Step Into, Step Out works
* Loads subvariables better (eg. a struct inside a struct)
* Shows 64bit integers
* Adds optional `timeout` configuration parameter
* Requires at least VSCode version 1.79

### 0.1.1

* Fixes breakpoint handling when there's multiple source files
* Shows stack in usual reversed order
* Fixes stack source path

### 0.1.0

* Breakpoints
  - Inlined code warning for breakpoints
* Call stack with functioning jump to source
* Primitive variables, arrays and structs


## NOTICE

This product's `.VSIX` file bundles `@vscode/debugadapter` and `@vscode/debugprotocol` which are both under the same MIT license:

```
Copyright (c) Microsoft Corporation

All rights reserved. 

MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

```
