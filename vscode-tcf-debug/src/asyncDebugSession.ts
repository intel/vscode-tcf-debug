/*
Copyright (C) 2023 Intel Corporation
SPDX-License-Identifier: MIT
*/
import { LoggingDebugSession } from "@vscode/debugadapter";
import { DebugProtocol } from "@vscode/debugprotocol";

export abstract class AsyncDebugSession extends LoggingDebugSession {

    protected initializeRequest(response: DebugProtocol.InitializeResponse, args: DebugProtocol.InitializeRequestArguments): void {
        this.initializeRequestAsync(response, args)
            .catch(e => {
                this.sendErrorResponse(response, 0, "Unhanded error in initializeRequest {message} {stack}", { message: e.message, stack: e.stack });
            });
    }

    protected async initializeRequestAsync(response: DebugProtocol.InitializeResponse, args: DebugProtocol.InitializeRequestArguments): Promise<void> {
        super.initializeRequest(response, args);
    }

    protected disconnectRequest(response: DebugProtocol.DisconnectResponse, args: DebugProtocol.DisconnectArguments, request?: DebugProtocol.Request): void {
        this.disconnectRequestAsync(response, args, request)
            .catch(e => {
                this.sendErrorResponse(response, 0, "Unhanded error in disconnectRequest {message} {stack}", { message: e.message, stack: e.stack });
            });
    }

    protected async disconnectRequestAsync(response: DebugProtocol.DisconnectResponse, args: DebugProtocol.DisconnectArguments, request?: DebugProtocol.Request): Promise<void> {
        super.disconnectRequest(response, args, request);
    }

    protected launchRequest(response: DebugProtocol.LaunchResponse, args: DebugProtocol.LaunchRequestArguments, request?: DebugProtocol.Request): void {
        this.launchRequestAsync(response, args, request)
            .catch(e => {
                this.sendErrorResponse(response, 0, "Unhanded error in launchRequest {message} {stack}", { message: e.message, stack: e.stack });
            });
    }

    protected async launchRequestAsync(response: DebugProtocol.LaunchResponse, args: DebugProtocol.LaunchRequestArguments, request?: DebugProtocol.Request): Promise<void> {
        super.launchRequest(response, args, request);
    }

    protected attachRequest(response: DebugProtocol.AttachResponse, args: DebugProtocol.AttachRequestArguments, request?: DebugProtocol.Request): void {
        this.attachRequestAsync(response, args, request)
            .catch(e => {
                this.sendErrorResponse(response, 0, "Unhanded error in attachRequest {message} {stack}", { message: e.message, stack: e.stack });
            });
    }

    protected async attachRequestAsync(response: DebugProtocol.AttachResponse, args: DebugProtocol.AttachRequestArguments, request?: DebugProtocol.Request): Promise<void> {
        super.attachRequest(response, args, request);
    }

    protected terminateRequest(response: DebugProtocol.TerminateResponse, args: DebugProtocol.TerminateArguments, request?: DebugProtocol.Request): void {
        this.terminateRequestAsync(response, args, request)
            .catch(e => {
                this.sendErrorResponse(response, 0, "Unhanded error in terminateRequest {message} {stack}", { message: e.message, stack: e.stack });
            });
    }

    protected async terminateRequestAsync(response: DebugProtocol.TerminateResponse, args: DebugProtocol.TerminateArguments, request?: DebugProtocol.Request): Promise<void> {
        super.terminateRequest(response, args, request);
    }

    protected restartRequest(response: DebugProtocol.RestartResponse, args: DebugProtocol.RestartArguments, request?: DebugProtocol.Request): void {
        this.restartRequestAsync(response, args, request)
            .catch(e => {
                this.sendErrorResponse(response, 0, "Unhanded error in restartRequest {message} {stack}", { message: e.message, stack: e.stack });
            });
    }

    protected async restartRequestAsync(response: DebugProtocol.RestartResponse, args: DebugProtocol.RestartArguments, request?: DebugProtocol.Request): Promise<void> {
        super.restartRequest(response, args, request);
    }

    protected setBreakPointsRequest(response: DebugProtocol.SetBreakpointsResponse, args: DebugProtocol.SetBreakpointsArguments, request?: DebugProtocol.Request): void {
        this.setBreakPointsRequestAsync(response, args, request)
            .catch(e => {
                this.sendErrorResponse(response, 0, "Unhanded error in setBreakPointsRequest {message} {stack}", { message: e.message, stack: e.stack });
            });
    }

    protected async setBreakPointsRequestAsync(response: DebugProtocol.SetBreakpointsResponse, args: DebugProtocol.SetBreakpointsArguments, request?: DebugProtocol.Request): Promise<void> {
        super.setBreakPointsRequest(response, args, request);
    }

    protected setFunctionBreakPointsRequest(response: DebugProtocol.SetFunctionBreakpointsResponse, args: DebugProtocol.SetFunctionBreakpointsArguments, request?: DebugProtocol.Request): void {
        this.setFunctionBreakPointsRequestAsync(response, args, request)
            .catch(e => {
                this.sendErrorResponse(response, 0, "Unhanded error in setFunctionBreakPointsRequest {message} {stack}", { message: e.message, stack: e.stack });
            });
    }

    protected async setFunctionBreakPointsRequestAsync(response: DebugProtocol.SetFunctionBreakpointsResponse, args: DebugProtocol.SetFunctionBreakpointsArguments, request?: DebugProtocol.Request): Promise<void> {
        super.setFunctionBreakPointsRequest(response, args, request);
    }

    protected setExceptionBreakPointsRequest(response: DebugProtocol.SetExceptionBreakpointsResponse, args: DebugProtocol.SetExceptionBreakpointsArguments, request?: DebugProtocol.Request): void {
        this.setExceptionBreakPointsRequestAsync(response, args, request)
            .catch(e => {
                this.sendErrorResponse(response, 0, "Unhanded error in setExceptionBreakPointsRequest {message} {stack}", { message: e.message, stack: e.stack });
            });
    }

    protected async setExceptionBreakPointsRequestAsync(response: DebugProtocol.SetExceptionBreakpointsResponse, args: DebugProtocol.SetExceptionBreakpointsArguments, request?: DebugProtocol.Request): Promise<void> {
        super.setExceptionBreakPointsRequest(response, args, request);
    }

    protected configurationDoneRequest(response: DebugProtocol.ConfigurationDoneResponse, args: DebugProtocol.ConfigurationDoneArguments, request?: DebugProtocol.Request): void {
        this.configurationDoneRequestAsync(response, args, request)
            .catch(e => {
                this.sendErrorResponse(response, 0, "Unhanded error in configurationDoneRequest {message} {stack}", { message: e.message, stack: e.stack });
            });
    }

    protected async configurationDoneRequestAsync(response: DebugProtocol.ConfigurationDoneResponse, args: DebugProtocol.ConfigurationDoneArguments, request?: DebugProtocol.Request): Promise<void> {
        super.configurationDoneRequest(response, args, request);
    }

    protected continueRequest(response: DebugProtocol.ContinueResponse, args: DebugProtocol.ContinueArguments, request?: DebugProtocol.Request): void {
        this.continueRequestAsync(response, args, request)
            .catch(e => {
                this.sendErrorResponse(response, 0, "Unhanded error in continueRequest {message} {stack}", { message: e.message, stack: e.stack });
            });
    }

    protected async continueRequestAsync(response: DebugProtocol.ContinueResponse, args: DebugProtocol.ContinueArguments, request?: DebugProtocol.Request): Promise<void> {
        super.continueRequest(response, args, request);
    }

    protected nextRequest(response: DebugProtocol.NextResponse, args: DebugProtocol.NextArguments, request?: DebugProtocol.Request): void {
        this.nextRequestAsync(response, args, request)
            .catch(e => {
                this.sendErrorResponse(response, 0, "Unhanded error in nextRequest {message} {stack}", { message: e.message, stack: e.stack });
            });
    }

    protected async nextRequestAsync(response: DebugProtocol.NextResponse, args: DebugProtocol.NextArguments, request?: DebugProtocol.Request): Promise<void> {
        super.nextRequest(response, args, request);
    }

    protected stepInRequest(response: DebugProtocol.StepInResponse, args: DebugProtocol.StepInArguments, request?: DebugProtocol.Request): void {
        this.stepInRequestAsync(response, args, request)
            .catch(e => {
                this.sendErrorResponse(response, 0, "Unhanded error in stepInRequest {message} {stack}", { message: e.message, stack: e.stack });
            });
    }

    protected async stepInRequestAsync(response: DebugProtocol.StepInResponse, args: DebugProtocol.StepInArguments, request?: DebugProtocol.Request): Promise<void> {
        super.stepInRequest(response, args, request);
    }

    protected stepOutRequest(response: DebugProtocol.StepOutResponse, args: DebugProtocol.StepOutArguments, request?: DebugProtocol.Request): void {
        this.stepOutRequestAsync(response, args, request)
            .catch(e => {
                this.sendErrorResponse(response, 0, "Unhanded error in stepOutRequest {message} {stack}", { message: e.message, stack: e.stack });
            });
    }

    protected async stepOutRequestAsync(response: DebugProtocol.StepOutResponse, args: DebugProtocol.StepOutArguments, request?: DebugProtocol.Request): Promise<void> {
        super.stepOutRequest(response, args, request);
    }

    protected stepBackRequest(response: DebugProtocol.StepBackResponse, args: DebugProtocol.StepBackArguments, request?: DebugProtocol.Request): void {
        this.stepBackRequestAsync(response, args, request)
            .catch(e => {
                this.sendErrorResponse(response, 0, "Unhanded error in stepBackRequest {message} {stack}", { message: e.message, stack: e.stack });
            });
    }

    protected async stepBackRequestAsync(response: DebugProtocol.StepBackResponse, args: DebugProtocol.StepBackArguments, request?: DebugProtocol.Request): Promise<void> {
        super.stepBackRequest(response, args, request);
    }

    protected reverseContinueRequest(response: DebugProtocol.ReverseContinueResponse, args: DebugProtocol.ReverseContinueArguments, request?: DebugProtocol.Request): void {
        this.reverseContinueRequestAsync(response, args, request)
            .catch(e => {
                this.sendErrorResponse(response, 0, "Unhanded error in reverseContinueRequest {message} {stack}", { message: e.message, stack: e.stack });
            });
    }

    protected async reverseContinueRequestAsync(response: DebugProtocol.ReverseContinueResponse, args: DebugProtocol.ReverseContinueArguments, request?: DebugProtocol.Request): Promise<void> {
        super.reverseContinueRequest(response, args, request);
    }

    protected restartFrameRequest(response: DebugProtocol.RestartFrameResponse, args: DebugProtocol.RestartFrameArguments, request?: DebugProtocol.Request): void {
        this.restartFrameRequestAsync(response, args, request)
            .catch(e => {
                this.sendErrorResponse(response, 0, "Unhanded error in restartFrameRequest {message} {stack}", { message: e.message, stack: e.stack });
            });
    }

    protected async restartFrameRequestAsync(response: DebugProtocol.RestartFrameResponse, args: DebugProtocol.RestartFrameArguments, request?: DebugProtocol.Request): Promise<void> {
        super.restartFrameRequest(response, args, request);
    }

    protected gotoRequest(response: DebugProtocol.GotoResponse, args: DebugProtocol.GotoArguments, request?: DebugProtocol.Request): void {
        this.gotoRequestAsync(response, args, request)
            .catch(e => {
                this.sendErrorResponse(response, 0, "Unhanded error in gotoRequest {message} {stack}", { message: e.message, stack: e.stack });
            });
    }

    protected async gotoRequestAsync(response: DebugProtocol.GotoResponse, args: DebugProtocol.GotoArguments, request?: DebugProtocol.Request): Promise<void> {
        super.gotoRequest(response, args, request);
    }

    protected pauseRequest(response: DebugProtocol.PauseResponse, args: DebugProtocol.PauseArguments, request?: DebugProtocol.Request): void {
        this.pauseRequestAsync(response, args, request)
            .catch(e => {
                this.sendErrorResponse(response, 0, "Unhanded error in pauseRequest {message} {stack}", { message: e.message, stack: e.stack });
            });
    }

    protected async pauseRequestAsync(response: DebugProtocol.PauseResponse, args: DebugProtocol.PauseArguments, request?: DebugProtocol.Request): Promise<void> {
        super.pauseRequest(response, args, request);
    }

    protected sourceRequest(response: DebugProtocol.SourceResponse, args: DebugProtocol.SourceArguments, request?: DebugProtocol.Request): void {
        this.sourceRequestAsync(response, args, request)
            .catch(e => {
                this.sendErrorResponse(response, 0, "Unhanded error in sourceRequest {message} {stack}", { message: e.message, stack: e.stack });
            });
    }

    protected async sourceRequestAsync(response: DebugProtocol.SourceResponse, args: DebugProtocol.SourceArguments, request?: DebugProtocol.Request): Promise<void> {
        super.sourceRequest(response, args, request);
    }

    protected threadsRequest(response: DebugProtocol.ThreadsResponse, request?: DebugProtocol.Request): void {
        this.threadsRequestAsync(response, request)
            .catch(e => {
                this.sendErrorResponse(response, 0, "Unhanded error in threadsRequest {message} {stack}", { message: e.message, stack: e.stack });
            });
    }

    protected async threadsRequestAsync(response: DebugProtocol.ThreadsResponse, request?: DebugProtocol.Request): Promise<void> {
        super.threadsRequest(response, request);
    }

    protected terminateThreadsRequest(response: DebugProtocol.TerminateThreadsResponse, args: DebugProtocol.TerminateThreadsArguments, request?: DebugProtocol.Request): void {
        this.terminateThreadsRequestAsync(response, args, request)
            .catch(e => {
                this.sendErrorResponse(response, 0, "Unhanded error in terminateThreadsRequest {message} {stack}", { message: e.message, stack: e.stack });
            });
    }

    protected async terminateThreadsRequestAsync(response: DebugProtocol.TerminateThreadsResponse, args: DebugProtocol.TerminateThreadsArguments, request?: DebugProtocol.Request): Promise<void> {
        super.terminateThreadsRequest(response, args, request);
    }

    protected stackTraceRequest(response: DebugProtocol.StackTraceResponse, args: DebugProtocol.StackTraceArguments, request?: DebugProtocol.Request): void {
        this.stackTraceRequestAsync(response, args, request)
            .catch(e => {
                this.sendErrorResponse(response, 0, "Unhanded error in stackTraceRequest {message} {stack}", { message: e.message, stack: e.stack });
            });
    }

    protected async stackTraceRequestAsync(response: DebugProtocol.StackTraceResponse, args: DebugProtocol.StackTraceArguments, request?: DebugProtocol.Request): Promise<void> {
        super.stackTraceRequest(response, args, request);
    }

    protected scopesRequest(response: DebugProtocol.ScopesResponse, args: DebugProtocol.ScopesArguments, request?: DebugProtocol.Request): void {
        this.scopesRequestAsync(response, args, request)
            .catch(e => {
                this.sendErrorResponse(response, 0, "Unhanded error in scopesRequest {message} {stack}", { message: e.message, stack: e.stack });
            });
    }

    protected async scopesRequestAsync(response: DebugProtocol.ScopesResponse, args: DebugProtocol.ScopesArguments, request?: DebugProtocol.Request): Promise<void> {
        super.scopesRequest(response, args, request);
    }

    protected variablesRequest(response: DebugProtocol.VariablesResponse, args: DebugProtocol.VariablesArguments, request?: DebugProtocol.Request): void {
        this.variablesRequestAsync(response, args, request)
            .catch(e => {
                this.sendErrorResponse(response, 0, "Unhanded error in variablesRequest {message} {stack}", { message: e.message, stack: e.stack });
            });
    }

    protected async variablesRequestAsync(response: DebugProtocol.VariablesResponse, args: DebugProtocol.VariablesArguments, request?: DebugProtocol.Request): Promise<void> {
        super.variablesRequest(response, args, request);
    }

    protected setVariableRequest(response: DebugProtocol.SetVariableResponse, args: DebugProtocol.SetVariableArguments, request?: DebugProtocol.Request): void {
        this.setVariableRequestAsync(response, args, request)
            .catch(e => {
                this.sendErrorResponse(response, 0, "Unhanded error in setVariableRequest {message} {stack}", { message: e.message, stack: e.stack });
            });
    }

    protected async setVariableRequestAsync(response: DebugProtocol.SetVariableResponse, args: DebugProtocol.SetVariableArguments, request?: DebugProtocol.Request): Promise<void> {
        super.setVariableRequest(response, args, request);
    }

    protected setExpressionRequest(response: DebugProtocol.SetExpressionResponse, args: DebugProtocol.SetExpressionArguments, request?: DebugProtocol.Request): void {
        this.setExpressionRequestAsync(response, args, request)
            .catch(e => {
                this.sendErrorResponse(response, 0, "Unhanded error in setExpressionRequest {message} {stack}", { message: e.message, stack: e.stack });
            });
    }

    protected async setExpressionRequestAsync(response: DebugProtocol.SetExpressionResponse, args: DebugProtocol.SetExpressionArguments, request?: DebugProtocol.Request): Promise<void> {
        super.setExpressionRequest(response, args, request);
    }

    protected evaluateRequest(response: DebugProtocol.EvaluateResponse, args: DebugProtocol.EvaluateArguments, request?: DebugProtocol.Request): void {
        this.evaluateRequestAsync(response, args, request)
            .catch(e => {
                this.sendErrorResponse(response, 0, "Unhanded error in evaluateRequest {message} {stack}", { message: e.message, stack: e.stack });
            });
    }

    protected async evaluateRequestAsync(response: DebugProtocol.EvaluateResponse, args: DebugProtocol.EvaluateArguments, request?: DebugProtocol.Request): Promise<void> {
        super.evaluateRequest(response, args, request);
    }

    protected stepInTargetsRequest(response: DebugProtocol.StepInTargetsResponse, args: DebugProtocol.StepInTargetsArguments, request?: DebugProtocol.Request): void {
        this.stepInTargetsRequestAsync(response, args, request)
            .catch(e => {
                this.sendErrorResponse(response, 0, "Unhanded error in stepInTargetsRequest {message} {stack}", { message: e.message, stack: e.stack });
            });
    }

    protected async stepInTargetsRequestAsync(response: DebugProtocol.StepInTargetsResponse, args: DebugProtocol.StepInTargetsArguments, request?: DebugProtocol.Request): Promise<void> {
        super.stepInTargetsRequest(response, args, request);
    }

    protected gotoTargetsRequest(response: DebugProtocol.GotoTargetsResponse, args: DebugProtocol.GotoTargetsArguments, request?: DebugProtocol.Request): void {
        this.gotoTargetsRequestAsync(response, args, request)
            .catch(e => {
                this.sendErrorResponse(response, 0, "Unhanded error in gotoTargetsRequest {message} {stack}", { message: e.message, stack: e.stack });
            });
    }

    protected async gotoTargetsRequestAsync(response: DebugProtocol.GotoTargetsResponse, args: DebugProtocol.GotoTargetsArguments, request?: DebugProtocol.Request): Promise<void> {
        super.gotoTargetsRequest(response, args, request);
    }

    protected completionsRequest(response: DebugProtocol.CompletionsResponse, args: DebugProtocol.CompletionsArguments, request?: DebugProtocol.Request): void {
        this.completionsRequestAsync(response, args, request)
            .catch(e => {
                this.sendErrorResponse(response, 0, "Unhanded error in completionsRequest {message} {stack}", { message: e.message, stack: e.stack });
            });
    }

    protected async completionsRequestAsync(response: DebugProtocol.CompletionsResponse, args: DebugProtocol.CompletionsArguments, request?: DebugProtocol.Request): Promise<void> {
        super.completionsRequest(response, args, request);
    }

    protected exceptionInfoRequest(response: DebugProtocol.ExceptionInfoResponse, args: DebugProtocol.ExceptionInfoArguments, request?: DebugProtocol.Request): void {
        this.exceptionInfoRequestAsync(response, args, request)
            .catch(e => {
                this.sendErrorResponse(response, 0, "Unhanded error in exceptionInfoRequest {message} {stack}", { message: e.message, stack: e.stack });
            });
    }

    protected async exceptionInfoRequestAsync(response: DebugProtocol.ExceptionInfoResponse, args: DebugProtocol.ExceptionInfoArguments, request?: DebugProtocol.Request): Promise<void> {
        super.exceptionInfoRequest(response, args, request);
    }

    protected loadedSourcesRequest(response: DebugProtocol.LoadedSourcesResponse, args: DebugProtocol.LoadedSourcesArguments, request?: DebugProtocol.Request): void {
        this.loadedSourcesRequestAsync(response, args, request)
            .catch(e => {
                this.sendErrorResponse(response, 0, "Unhanded error in loadedSourcesRequest {message} {stack}", { message: e.message, stack: e.stack });
            });
    }

    protected async loadedSourcesRequestAsync(response: DebugProtocol.LoadedSourcesResponse, args: DebugProtocol.LoadedSourcesArguments, request?: DebugProtocol.Request): Promise<void> {
        super.loadedSourcesRequest(response, args, request);
    }

    protected dataBreakpointInfoRequest(response: DebugProtocol.DataBreakpointInfoResponse, args: DebugProtocol.DataBreakpointInfoArguments, request?: DebugProtocol.Request): void {
        this.dataBreakpointInfoRequestAsync(response, args, request)
            .catch(e => {
                this.sendErrorResponse(response, 0, "Unhanded error in dataBreakpointInfoRequest {message} {stack}", { message: e.message, stack: e.stack });
            });
    }

    protected async dataBreakpointInfoRequestAsync(response: DebugProtocol.DataBreakpointInfoResponse, args: DebugProtocol.DataBreakpointInfoArguments, request?: DebugProtocol.Request): Promise<void> {
        super.dataBreakpointInfoRequest(response, args, request);
    }

    protected setDataBreakpointsRequest(response: DebugProtocol.SetDataBreakpointsResponse, args: DebugProtocol.SetDataBreakpointsArguments, request?: DebugProtocol.Request): void {
        this.setDataBreakpointsRequestAsync(response, args, request)
            .catch(e => {
                this.sendErrorResponse(response, 0, "Unhanded error in setDataBreakpointsRequest {message} {stack}", { message: e.message, stack: e.stack });
            });
    }

    protected async setDataBreakpointsRequestAsync(response: DebugProtocol.SetDataBreakpointsResponse, args: DebugProtocol.SetDataBreakpointsArguments, request?: DebugProtocol.Request): Promise<void> {
        super.setDataBreakpointsRequest(response, args, request);
    }

    protected readMemoryRequest(response: DebugProtocol.ReadMemoryResponse, args: DebugProtocol.ReadMemoryArguments, request?: DebugProtocol.Request): void {
        this.readMemoryRequestAsync(response, args, request)
            .catch(e => {
                this.sendErrorResponse(response, 0, "Unhanded error in readMemoryRequest {message} {stack}", { message: e.message, stack: e.stack });
            });
    }

    protected async readMemoryRequestAsync(response: DebugProtocol.ReadMemoryResponse, args: DebugProtocol.ReadMemoryArguments, request?: DebugProtocol.Request): Promise<void> {
        super.readMemoryRequest(response, args, request);
    }

    protected writeMemoryRequest(response: DebugProtocol.WriteMemoryResponse, args: DebugProtocol.WriteMemoryArguments, request?: DebugProtocol.Request): void {
        this.writeMemoryRequestAsync(response, args, request)
            .catch(e => {
                this.sendErrorResponse(response, 0, "Unhanded error in writeMemoryRequest {message} {stack}", { message: e.message, stack: e.stack });
            });
    }

    protected async writeMemoryRequestAsync(response: DebugProtocol.WriteMemoryResponse, args: DebugProtocol.WriteMemoryArguments, request?: DebugProtocol.Request): Promise<void> {
        super.writeMemoryRequest(response, args, request);
    }

    protected disassembleRequest(response: DebugProtocol.DisassembleResponse, args: DebugProtocol.DisassembleArguments, request?: DebugProtocol.Request): void {
        this.disassembleRequestAsync(response, args, request)
            .catch(e => {
                this.sendErrorResponse(response, 0, "Unhanded error in disassembleRequest {message} {stack}", { message: e.message, stack: e.stack });
            });
    }

    protected async disassembleRequestAsync(response: DebugProtocol.DisassembleResponse, args: DebugProtocol.DisassembleArguments, request?: DebugProtocol.Request): Promise<void> {
        super.disassembleRequest(response, args, request);
    }

    protected cancelRequest(response: DebugProtocol.CancelResponse, args: DebugProtocol.CancelArguments, request?: DebugProtocol.Request): void {
        this.cancelRequestAsync(response, args, request)
            .catch(e => {
                this.sendErrorResponse(response, 0, "Unhanded error in cancelRequest {message} {stack}", { message: e.message, stack: e.stack });
            });
    }

    protected async cancelRequestAsync(response: DebugProtocol.CancelResponse, args: DebugProtocol.CancelArguments, request?: DebugProtocol.Request): Promise<void> {
        super.cancelRequest(response, args, request);
    }

    protected breakpointLocationsRequest(response: DebugProtocol.BreakpointLocationsResponse, args: DebugProtocol.BreakpointLocationsArguments, request?: DebugProtocol.Request): void {
        this.breakpointLocationsRequestAsync(response, args, request)
            .catch(e => {
                this.sendErrorResponse(response, 0, "Unhanded error in breakpointLocationsRequest {message} {stack}", { message: e.message, stack: e.stack });
            });
    }

    protected async breakpointLocationsRequestAsync(response: DebugProtocol.BreakpointLocationsResponse, args: DebugProtocol.BreakpointLocationsArguments, request?: DebugProtocol.Request): Promise<void> {
        super.breakpointLocationsRequest(response, args, request);
    }

    protected setInstructionBreakpointsRequest(response: DebugProtocol.SetInstructionBreakpointsResponse, args: DebugProtocol.SetInstructionBreakpointsArguments, request?: DebugProtocol.Request): void {
        this.setInstructionBreakpointsRequestAsync(response, args, request)
            .catch(e => {
                this.sendErrorResponse(response, 0, "Unhanded error in setInstructionBreakpointsRequest {message} {stack}", { message: e.message, stack: e.stack });
            });
    }

    protected async setInstructionBreakpointsRequestAsync(response: DebugProtocol.SetInstructionBreakpointsResponse, args: DebugProtocol.SetInstructionBreakpointsArguments, request?: DebugProtocol.Request): Promise<void> {
        super.setInstructionBreakpointsRequest(response, args, request);
    }

    protected customRequest(command: string, response: DebugProtocol.Response, args: any, request?: DebugProtocol.Request): void {
        this.customRequestAsync(command, response, args, request)
            .catch(e => {
                this.sendErrorResponse(response, 0, "Unhanded error in customRequest {message} {stack}", { message: e.message, stack: e.stack });
            });
    }

    protected async customRequestAsync(command: string, response: DebugProtocol.Response, args: any, request?: DebugProtocol.Request): Promise<void> {
        super.customRequest(command, response, args, request);
    }

}