/*
Copyright (C) 2023 Intel Corporation
SPDX-License-Identifier: MIT
*/
import * as fs from 'fs';

//see https://www.tcpdump.org/linktypes.html
export enum LinkType {
    raw = 101,
    user0 = 147
}

const PCAP_GLOBAL_HEADER_SIZE = 24; //bytes
//https://datatracker.ietf.org/doc/id/draft-gharris-opsawg-pcap-00.html#name-file-header
export function pcapGlobalHeader() {
    const globalHeader = Buffer.alloc(PCAP_GLOBAL_HEADER_SIZE); //little endian!

    globalHeader.writeUInt32LE(0xA1B2C3D4, 0); //magic number: seconds and microseconds (NO nanoseconds)
    globalHeader.writeUInt16LE(2, 0 + 4); //major version
    globalHeader.writeUInt16LE(4, 4 + 2); //minor version
    globalHeader.writeUInt32LE(0, 6 + 2); //reserved1
    globalHeader.writeUInt32LE(0, 8 + 4); //reserved2
    globalHeader.writeUInt32LE(1000000000, 12 + 4);//snap length, a very larger number. TODO: use max_int32?
    //see https://www.tcpdump.org/linktypes.html
    globalHeader.writeUInt32LE(LinkType.raw, 16 + 4); //private use link type

    return globalHeader;
}

function validatePcapGlobalHeader(header: Buffer) {
    if (header.length !== PCAP_GLOBAL_HEADER_SIZE) {
        throw new Error(`Global header wrong size ${header.length} vs ${PCAP_GLOBAL_HEADER_SIZE}`);
    }

    //expect identical endianness
    if (0xA1B2C3D4 !== header.readUInt32LE(0)) {
        throw new Error("Bad global magic number");
    }

    const linkType = header.readUint32LE(16 + 4);
    if (linkType !== LinkType.raw) {
        throw new Error(`Unsupported pcap link type ${linkType}, expected ${LinkType.raw}`);
    }
}

const PCAP_PACKET_HEADER_SIZE = 16;

//see https://datatracker.ietf.org/doc/id/draft-gharris-opsawg-pcap-00.html#name-packet-record
export function pcapPacketHeader(unixTimestampSec: number, dataLength: number) {
    const header = Buffer.alloc(PCAP_PACKET_HEADER_SIZE); //little endian!

    header.writeUInt32LE(unixTimestampSec, 0);
    header.writeUInt32LE(0, 0 + 4); //microseconds
    header.writeUInt32LE(dataLength, 4 + 4);
    header.writeUInt32LE(dataLength, 8 + 4); //original packet length. May be different in theory if snapped

    return header;
}

export interface TimestampedBuffer {
    unixTimestampSec: number;
    data: Buffer;
}

export function pcapRead(fd: number): TimestampedBuffer {
    const header = readBuffer(fd, PCAP_PACKET_HEADER_SIZE);
    const unixTimestampSec = header.readUint32LE(0);
    const dataLength = header.readUint32LE(4 + 4);
    const data = readBuffer(fd, dataLength);

    return {
        unixTimestampSec,
        data
    };
}

const IPV4_HEADER_SIZE = 20; //Note: this technically is not fixed!
export function ipv4Header(b: Buffer, sourceIP: number[], destIP: number[]): Buffer {
    const size = IPV4_HEADER_SIZE; // 20 bytes for buffer
    const header = Buffer.alloc(size); //little endian!

    header.writeUInt8(4 * 16 /* version IPV4 */ + (size / 4) /* size of header in 32bit words */);
    header.writeUInt8(0, 1); // DSCP + ECN
    header.writeUInt16BE(size + b.length, 2); //total length //Why do we have BIG ENDIAN here? tcpdump cannot parse it otherwise
    header.writeUInt16LE(0, 4); //identification
    header.writeUint16LE(0, 6); //fragment flags + fragment offset
    header.writeUInt8(1, 6 + 2); //TTL
    //https://en.wikipedia.org/wiki/List_of_IP_protocol_numbers
    const PROTOCOL_TCP = 6;
    const PROTOCOL_ANY_LOCAL = 63;
    header.writeUint8(PROTOCOL_ANY_LOCAL, 8 + 1); //protocol
    //TODO: compute checksum
    header.writeUint16LE(0, 9 + 1); //bad checksum, always 0
    //source IP address
    header.writeInt8(sourceIP[0], 12);
    header.writeInt8(sourceIP[1], 13);
    header.writeInt8(sourceIP[2], 14);
    header.writeInt8(sourceIP[3], 15);
    //dest IP address
    header.writeInt8(destIP[0], 16);
    header.writeInt8(destIP[1], 17);
    header.writeInt8(destIP[2], 18);
    header.writeInt8(destIP[3], 19);

    return header;
}

export function ipv4Unwrap(b: Buffer) {
    const header = b.subarray(0, IPV4_HEADER_SIZE); //XXX: This assumes a fixed IPv4 header size but it should actually be read! Good enough for test files but not more.

    const sourceIP = [header.readInt8(12), header.readInt8(13), header.readInt8(14), header.readInt8(15)];
    const destIP = [header.readInt8(16), header.readInt8(17), header.readInt8(18), header.readInt8(19)];

    const data = b.subarray(IPV4_HEADER_SIZE);

    return {
        sourceIP,
        destIP,
        data
    };
}

export function pcapCreate(name: string): WriteablePcap {
    const fd = fs.createWriteStream(name);

    const w = new FileWriteablePcap(fd);
    w.write(pcapGlobalHeader());

    return w;
}

export interface WriteablePcap {
    /**
     * Schedule buffer to be written to pcap file.
     * Note that this returns imediatelly.
     * @param b data
     */
    write(b: Buffer): void;

    /**
     * Closes the pcap file. This is async since there may still be unwritten data.
     */
    close(): Promise<void>;
}

class FileWriteablePcap implements WriteablePcap {
    f: fs.WriteStream;
    p: Promise<void> = Promise.resolve();

    constructor(f: fs.WriteStream) {
        this.f = f;
    }

    async close(): Promise<void> {
        return new Promise<void>((success, error) => {
            this.f.close((err) => {
                if (err) {
                    error(err);
                } else {
                    success();
                }
            });
        });
    }

    write(b: Buffer): void {
        const wp = new Promise<void>((success) => {
            if (this.f.write(b)) {
                success();
            } else {
                this.f.once('drain', success);
            }
        });

        // chaining write promises
        this.p = this.p.then(() => wp);
    }
}

export function readBuffer(fd: number, size: number) {
    const header = Buffer.alloc(size);
    const bytesRead = fs.readSync(fd, header, 0, header.length, null);
    if (bytesRead !== header.length) {
        throw new Error(`Could not read ${size} bytes`);
    }
    return header;
}

export function pcapOpen(name: string) {
    const fd = fs.openSync(name, "r");

    const header = readBuffer(fd, PCAP_GLOBAL_HEADER_SIZE);
    validatePcapGlobalHeader(header);

    return fd;
}

export function pcapAppend(fd: WriteablePcap, b: Buffer, timestampSec?: number) {
    if (timestampSec === undefined) {
        timestampSec = new Date().getTime() / 1000;
    }
    fd.write(pcapPacketHeader(timestampSec, b.length));
    fd.write(b);

    return fd;
}

export function pcapClose(fd: number) {
    fs.closeSync(fd);
}