/*
Copyright (C) 2023 Intel Corporation
SPDX-License-Identifier: MIT
*/
/* eslint-disable no-console */
import assert = require("assert");
import { TestTCFClient } from "../unitTest";
import { ipv4Header, pcapAppend, pcapCreate, PCAP_LOCALHOST, PCAP_OTHER_HOST, HelloLocatorEvent, SmallCommandStamper, SimpleCommandStamper, GetContextRunControlCommand, SimpleCommand, QueryCommand, join } from "vscode-tcf-debug/out/tcf-all";

export async function createEmptyPcap(output: string, tokenGen: SimpleCommandStamper) {
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
    packet = new HelloLocatorEvent(["ContextQuery", "Locator"]).toBuffer();
    pcapAppend(outFD,
        Buffer.concat(
            [ipv4Header(packet, PCAP_OTHER_HOST, PCAP_LOCALHOST),
                packet,
            ]),
    );


    //next a query
    let command: SimpleCommand<any> = new QueryCommand("*");
    let token = tokenGen.createToken(command);
    packet = command.toBuffer(token);
    pcapAppend(outFD,
        Buffer.concat(
            [ipv4Header(packet, PCAP_LOCALHOST, PCAP_OTHER_HOST),
                packet,
            ]),
    );

    packet = join([
        Buffer.from("R"),
        Buffer.from(token), // "ContextQuery/0/query/*"),
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

    await outFD.close();
}

export function badServiceSuite() {
    it("Reject unsupported service", async function () {
        // await createEmptyPcap("src/test/test-bad-service.pcap", new SmallCommandStamper());

        const t = new TestTCFClient();
        t.playback("src/test/test-bad-service.pcap");
        t.connect("localhost", 123);

        try {
            await t.sendCommand(new GetContextRunControlCommand("someContext"));
        } catch (e) {
            assert.ok(e instanceof Error);
            assert.equal((e as Error).message, "Service RunControl not supported by remote TCF");
        } finally {
            t.disconnect();
        }
    });
}