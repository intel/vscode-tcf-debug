## Release notes

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