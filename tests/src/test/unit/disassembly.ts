/*
Copyright (C) 2023 Intel Corporation
SPDX-License-Identifier: MIT
*/
/* eslint-disable no-console */
import { TCFDebugSession, TCFLaunchRequestArguments } from "vscode-tcf-debug/out/debugProvider";
import { DebugProtocol } from "@vscode/debugprotocol";
import { Source } from "@vscode/debugadapter";
import assert = require("assert");
import { TinyDAP } from "../unitTest";

export function disassemblySuite(playbackFile: string, file: string, line: number, handler: ((i: DebugProtocol.DisassembledInstruction[] | undefined) => void)) {
    let afterCleanup: (() => void)[] = [];

    it("Disassemble", async function () {
        this.timeout(130 * 1000); //bump mocha timeout on playback
        const session = new TCFDebugSession();
        const dap = new TinyDAP(session);
        afterCleanup.push(function () {
            //disconnect (and indirectly close socket) at the end
            if (session) {
                session.handleMessage({
                    command: 'disconnect',
                    seq: 10000, //just a seq number, should be big enough
                    type: 'request'
                } as DebugProtocol.DisconnectRequest);
            }
        });

        const initializedPromise = dap.forEvent('initialized');

        await dap.send({
            arguments: {
                breakpointPrefix: "",
                host: "127.0.0.1",
                // record: playbackFile,
                playback: playbackFile,
                // debugTCFMessages: true
            } as TCFLaunchRequestArguments,
            command: 'launch',
            seq: 0,// doesn't matter, will be replaced
            type: 'request'
        } as DebugProtocol.LaunchRequest);

        await initializedPromise;

        console.log("\nawaiting on setBreakpoints");
        await dap.send({
            command: 'setBreakpoints',
            type: 'request',
            arguments: {
                source: new Source(file, file),
                lines: [line]
            }
        } as DebugProtocol.SetBreakpointsRequest);

        console.log("\nawaiting on configurationDone");
        await dap.send({
            command: 'configurationDone',
            type: 'request',
        } as DebugProtocol.ConfigurationDoneRequest);

        // //await breakpointPromise;
        console.log("\nawaiting on stoppedPromise");
        const stoppedData = await dap.forEvent('stopped');
        const threadId = (stoppedData as DebugProtocol.StoppedEvent).body.threadId;
        console.log(JSON.stringify(stoppedData));

        // //NOTE: waterfall is threads->stacktrace->Scope->Variables ... Variables

        console.log("\nWaiting on threads");
        const threads = await dap.send({
            command: 'threads',
            type: 'request',
        } as DebugProtocol.ThreadsRequest);
        console.log(JSON.stringify(threads));

        console.log("\nWaiting on stack traces");
        const stacktraces = await dap.send({
            command: 'stackTrace',
            type: 'request',
            arguments: {
                threadId: threadId
            }
        } as DebugProtocol.StackTraceRequest);
        console.log(JSON.stringify(stacktraces));

        const stackFrames = (stacktraces as DebugProtocol.StackTraceResponse).body.stackFrames;

        console.log(`Stack frames ${JSON.stringify(stackFrames)}`);

        const frameId = stackFrames[0].id;
        const memoryReference = stackFrames[0].instructionPointerReference;

        console.log("\nWaiting on scopes");
        const scopes = await dap.send({
            command: 'scopes',
            type: 'request',
            arguments: {
                frameId
            }
        } as DebugProtocol.ScopesRequest);
        console.log(JSON.stringify(scopes));

        const localVarsReference = (scopes as DebugProtocol.ScopesResponse).body.scopes[0].variablesReference;

        console.log("\nAwaiting variables response");
        const variableResponse = await dap.send({
            command: 'variables',
            type: 'request',
            arguments: {
                variablesReference: localVarsReference
            }
        } as DebugProtocol.VariablesRequest);

        console.log("Got variable response");
        const variables = (variableResponse as DebugProtocol.VariablesResponse).body.variables;
        console.log(variables);

        console.log("\nWaiting on disassemble");
        const disassembleResponse = await dap.send({
            command: 'disassemble',
            type: 'request',
            arguments: {
                memoryReference: memoryReference,
                offset: 0,
                instructionOffset: -100,
                instructionCount: 200
            }
        } as DebugProtocol.DisassembleRequest);
        console.log(JSON.stringify(disassembleResponse));

        console.log("Got disassemble response");
        const instructions = (disassembleResponse as DebugProtocol.DisassembleResponse).body?.instructions;
        handler(instructions);
    });

    after(function () {
        afterCleanup.forEach(x => x());
    });
}