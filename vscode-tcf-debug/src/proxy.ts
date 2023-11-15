/*
Copyright (C) 2023 Intel Corporation
SPDX-License-Identifier: MIT
*/
/* eslint no-console: "off" */
import * as net from "net";
import { EMPTY_BUFFER, TCF_END_OF_PACKET_MARKER, ipv4Header, pcapAppend, pcapClose, pcapCreate } from "./tcf-all";

const PORT = 1535;
const OTHER_PORT = 1534;
const OTHER_HOST = "127.0.0.1";

const PCAP_LOCALHOST = [127, 0, 0, 1];
const PCAP_OTHER_HOST = [127, 0, 0, 2];

const pcapFile = pcapCreate("proxy.pcap");

var server = net.createServer(function (socket) {
    console.log(`Proxy connection open, forwarding to ${OTHER_HOST}:${OTHER_PORT}`);

    const proxy = new net.Socket();
    proxy.setKeepAlive(true);
    proxy.setNoDelay(true);
    proxy.connect(OTHER_PORT, OTHER_HOST);

    {
        let prevData = EMPTY_BUFFER;
        proxy.on('data', data => {
            console.log("Proxy got");
            console.log(data.toString());

            socket.write(data);

            {
                prevData = Buffer.concat([prevData, data]);

                while (true) {
                    const eom = prevData.indexOf(TCF_END_OF_PACKET_MARKER);
                    if (eom !== -1) {
                        const packet = prevData.subarray(0, eom);
                        prevData = prevData.subarray(eom + 2);

                        pcapAppend(pcapFile, Buffer.concat([ipv4Header(packet, PCAP_OTHER_HOST, PCAP_LOCALHOST), packet, TCF_END_OF_PACKET_MARKER]));
                    } else {
                        //this buffer has no EOM, we stil need to receive more data
                        return;
                    }
                }
            }
        });
    }
    proxy.on('error', err => {
        console.log("Forwarded connection error: App <----> This proxy <-- here --> actual TCF agent");
        console.log(err);
        console.log("Disconnecting");
        socket.end();
        console.log("Closing pcap file");
        pcapFile.close()
            .catch(e => console.log(e));
    });

    {
        let prevData = EMPTY_BUFFER;
        socket.on('data', data => {
            console.log("Got");
            console.log(data.toJSON());
            console.log(data.toString());
            proxy.write(data);
            {
                prevData = Buffer.concat([prevData, data]);

                while (true) {
                    const eom = prevData.indexOf(TCF_END_OF_PACKET_MARKER);
                    if (eom !== -1) {
                        const packet = prevData.subarray(0, eom);
                        prevData = prevData.subarray(eom + 2);

                        //note the reverted IP addresses
                        pcapAppend(pcapFile, Buffer.concat([ipv4Header(packet, PCAP_LOCALHOST, PCAP_OTHER_HOST), packet, TCF_END_OF_PACKET_MARKER]));
                    } else {
                        //this buffer has no EOM, we stil need to receive more data
                        return;
                    }
                }
            }
        });
    }
    socket.on('error', err => {
        console.log("Direct connection error: App <-- here --> This proxy <----> actual TCF agent");
        console.log(err);

        proxy.end();

        console.log("Closing pcap file");
        pcapFile.close()
            .catch(e => console.log(e));
    });
});

console.log(`Starting TCF proxy on port ${PORT}`);
server.listen(PORT, '127.0.0.1');
