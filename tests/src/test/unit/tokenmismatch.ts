/*
Copyright (C) 2023 Intel Corporation
SPDX-License-Identifier: MIT
*/
/* eslint-disable no-console */
import { TCFDebugSession, TCFLaunchRequestArguments } from "vscode-tcf-debug/out/debugProvider";
import { DebugProtocol } from "@vscode/debugprotocol";
import assert = require("assert");
import { TinyDAP } from "../unitTest";
import { ipv4Header, pcapAppend, pcapCreate, PCAP_LOCALHOST, PCAP_OTHER_HOST, HelloLocatorEvent, QueryCommand, join, SetBreakpointsCommand } from "vscode-tcf-debug/out/tcf-all";

async function createPcapWithMismatchedToken(output: string) {
    const END_OF_PACKET_MARKER = Uint8Array.from([3, 1]);

    const outFD = pcapCreate(output);

    //we send Hello 
    let packet = new HelloLocatorEvent().toBuffer();
    pcapAppend(outFD,
        Buffer.concat(
            [ipv4Header(packet, PCAP_LOCALHOST, PCAP_OTHER_HOST),
                packet,
            ]),
    );

    //should receive a reply
    packet = new HelloLocatorEvent().toBuffer();
    pcapAppend(outFD,
        Buffer.concat(
            [ipv4Header(packet, PCAP_OTHER_HOST, PCAP_LOCALHOST),
                packet,
            ]),
    );
    //next a query
    packet = new QueryCommand("*").toBuffer();
    pcapAppend(outFD,
        Buffer.concat(
            [ipv4Header(packet, PCAP_LOCALHOST, PCAP_OTHER_HOST),
                packet,
            ]),
    );

    packet = join([
        Buffer.from("R"),
        Buffer.from("ContextQuery/0/query/*"),
        Buffer.from([]), //error report
        Buffer.from(JSON.stringify([])), //not list of IDs, to avoid some more commands
    ]);
    pcapAppend(outFD,
        Buffer.concat(
            [ipv4Header(packet, PCAP_OTHER_HOST, PCAP_LOCALHOST),
                packet,
            Buffer.from([0]),
            Buffer.from(END_OF_PACKET_MARKER)]),
    );

    //handshake finished, add breakpoints
    packet = new SetBreakpointsCommand([]).toBuffer();
    pcapAppend(outFD,
        Buffer.concat(
            [ipv4Header(packet, PCAP_OTHER_HOST, PCAP_LOCALHOST),
                packet,
            ]),
    );

    //breakpoint reply
    packet = join([
        Buffer.from("R"),
        Buffer.from("Breakpoints/0/set/0"),
        Buffer.from([]), //error report
        Buffer.from([]),
    ]);
    pcapAppend(outFD,
        Buffer.concat(
            [ipv4Header(packet, PCAP_OTHER_HOST, PCAP_LOCALHOST),
                packet,
            Buffer.from([0]),
            Buffer.from(END_OF_PACKET_MARKER)]),
    );

    // let's put a reply with an unexpected token
    packet = join([
        Buffer.from("R"),
        Buffer.from("SomeService/1/someCommand"), //bad token
        Buffer.from([]), //error report
        Buffer.from("hey")
    ]);
    pcapAppend(outFD,
        Buffer.concat(
            [ipv4Header(packet, PCAP_OTHER_HOST, PCAP_LOCALHOST),
                packet,
            Buffer.from([0]),
            Buffer.from(END_OF_PACKET_MARKER)]),
    );

    await outFD.close();
}

export function tokenMismatchSuite() {
    let afterCleanup: (() => void)[] = [];

    it("Mismatched token in reply", async function () {
        // await createPcapWithMismatchedToken("src/test/test-mismatched-token.pcap");

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
                playback: "src/test/test-mismatched-token.pcap",
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

        const outputPromise = dap.forEvent('output');
        console.log("\nawaiting on console output");
        const out = await outputPromise;

        console.log("out is");
        console.log(out);
        assert.ok(out.body.output.includes("No command with this token"));
    });

    after(function () {
        afterCleanup.forEach(x => x());
    });
}