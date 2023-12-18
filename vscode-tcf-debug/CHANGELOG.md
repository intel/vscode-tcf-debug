## Release notes

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
