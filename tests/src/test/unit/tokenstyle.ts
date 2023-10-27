/*
Copyright (C) 2023 Intel Corporation
SPDX-License-Identifier: MIT
*/
/* eslint-disable no-console */
import { TCFDebugSession, TCFLaunchRequestArguments } from "vscode-tcf-debug/out/debugProvider";
import { DebugProtocol } from "@vscode/debugprotocol";
import assert = require("assert");
import { TinyDAP } from "../unitTest";
import { ipv4Header, pcapAppend, pcapCreate, PCAP_LOCALHOST, PCAP_OTHER_HOST, HelloLocatorEvent, QueryCommand, join, SetBreakpointsCommand, SimpleCommand, SmallCommandStamper } from "vscode-tcf-debug/out/tcf-all";
import { createPcapWithMismatchedToken } from "./tokenmismatch";

export function tokenStyleSuite() {
    let afterCleanup: (() => void)[] = [];

    it("Plain token style", async function () {
        // await createPcapWithMismatchedToken("src/test/test-small-token-style.pcap", new SmallCommandStamper());

        this.timeout(30 * 1000); //bump mocha timeout on playback
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
                playback: "src/test/test-small-token-style.pcap",
                playbackFlag: {
                    consumeEventsRepliesEagerly: true
                }
                // debugTCFMessages: true
            } as TCFLaunchRequestArguments,
            command: 'launch',
            seq: 0,// doesn't matter, will be replaced
            type: 'request'
        } as DebugProtocol.LaunchRequest);

        await initializedPromise;

        //just happy if it gets this far
    });

    after(function () {
        afterCleanup.forEach(x => x());
    });
}