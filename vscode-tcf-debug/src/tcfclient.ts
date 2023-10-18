/*
Copyright (C) 2022, 2023 Intel Corporation
SPDX-License-Identifier: MIT
*/
import { AbstractTCFClient } from "./tcf";
import { BreakpointData, BreakpointStatus, InstanceStatusData, asBreakpointData, asBreakpointStatus } from "./tcf/breakpoints";
import { EvaluateExpressionsCommand, EvaluateResult, GetChildrenExpressionCommand } from "./tcf/expressions";
import { MapToSourceLineNumbersCommand, TCFCodeAreaLineNumbers } from "./tcf/linenumbers";
import { asNullableTCFContextData, asTCFContextData, ContextSuspendedData, GetChildrenRunControlCommand, GetContextRunControlCommand, GetStateRunControlCommand, parseContextSuspended, TCFContextData, TCFStateData } from "./tcf/runcontrol";
import { GetChildrenStackTraceCommand, GetContextStackTraceCommand, TCFContextDataStackTrace } from "./tcf/stacktrace";
import { FindByAddrSymbolsCommand, GetContextSymbolsCommand, TCFTypeClass } from "./tcf/symbols";
import { asArray, asNullableArray, asString, asStringArray, CancellationFunction, InterruptedError, parseResponse, responseLengthAbout, SimpleCommand, TCFPartialResultError } from "./tcf/tcfutils";
import { DefaultVariableHelper } from "./variables/helper";
import { SymbolRawValueProvider } from "./variables/symbol";
import { ClientVariable, SymbolNameProvider } from "./variables/types";
import * as validateBreakpointData from './tcf/validators/validate-BreakpointData';

export const DEFAULT_SEND_COMMAND_CHUNK_SIZE = 10;

export abstract class TCFClient extends AbstractTCFClient {

    async getVariables(): Promise<ClientVariable[]> {
        let result: ClientVariable[] = [];
        const runControlContexts = await this.loadChildren(null);
        for (const ctx of runControlContexts) {
            const ctxVariables = await this.getContextVariables(ctx);
            result = result.concat(ctxVariables);
        }
        return result;
    }

    async getContextVariables(ctx: string): Promise<ClientVariable[]> {
        let result: ClientVariable[] = [];
        try {
            const stacks = await this.sendCommand(new GetChildrenStackTraceCommand(ctx)) || [];
            for (const stack of stacks) {
                const stackVariables = await this.getStackVariables(ctx, stack);
                result = result.concat(stackVariables);
            }
        } catch (e) {
            this.console.error("Get children stacktrace error " + JSON.stringify(e)); //Execution context is running? Continue...
        }
        return result;
    }

    async getStackVariables(ctx: string, stack: string): Promise<ClientVariable[]> {
        let result: ClientVariable[] = [];
        try {
            const varNames = await this.sendCommand(new GetChildrenExpressionCommand(stack));
            for (const varName of varNames) {
                const v = await this.getExpressionIDVariable(ctx, stack, varName);
                if (!v) {
                    continue;
                }
                result.push(v);
            }
        } catch (e) {
            this.console.error("Get children expression error " + JSON.stringify(e)); //TODO: this shouldn't happen?
        }
        return result;
    }

    private async evalVariableSymbolAndType(ctx: string, varName: string): Promise<[type: string, symbol: string] | undefined> {
        let value;
        let isPartial = false;
        try {
            value = await this.sendCommand(new EvaluateExpressionsCommand(varName));
        } catch (e) {
            if (e instanceof TCFPartialResultError) {
                const partial = e as TCFPartialResultError<EvaluateResult>;
                //Such partial data was seen:
                // {"result":{"value":{"type":"Buffer","data":[110,117,108,108]},"properties":null}}
                //thus, ignoring partial results without .properties
                if (partial.result.properties !== null) {
                    value = partial.result;
                    isPartial = true;
                    //TODO: besides the (partial) value, we should also signal in the final result that *it is a partial value*
                    // then the UI could display it differently
                }
            }
            if (!value) {
                this.console.error("Evaluate expression error " + JSON.stringify(e)); //Eval error?
            }
        }

        if (value && value.properties !== null && value.properties.Type && value.properties.Symbol) {
            return [value.properties.Type, value.properties.Symbol];
        } else {
            return undefined;
        }
    }

    async getExpressionIDVariable(ctx: string, stack: string, varName: string): Promise<ClientVariable | undefined> {
        const value = await this.evalVariableSymbolAndType(ctx, varName);
        if (!value) {
            this.console.error(`Could not parse value for ${varName} = ${JSON.stringify(value)}`);
            //no symbol, may be an array?
            return undefined;
        }
        const [typeID, symbolID] = value;

        this.console.received(`Value ${varName} ${JSON.stringify(value)}`);

        const typeDetails = await this.sendCommand(new GetContextSymbolsCommand(typeID));
        const symbolDetails = await this.sendCommand(new GetContextSymbolsCommand(symbolID));

        this.console.received(`Got variable ${symbolDetails.Name}`);

        if (typeDetails.TypeClass !== symbolDetails.TypeClass) {
            //shouldn't happen?
            console.log(`Different typeclass? For ${varName} ${JSON.stringify(value)} ${JSON.stringify(typeDetails)} ${JSON.stringify(symbolDetails)}`);
        }


        const self = this;
        const helper = new class extends DefaultVariableHelper {
            log(message: string): void {
                self.console.log(message);
            }
            sendCommand<T>(c: SimpleCommand<T>): Promise<T> {
                return self.sendCommand(c);
            }
        }();

        return helper.createVariable(typeDetails, symbolDetails, new SymbolNameProvider(symbolDetails), new SymbolRawValueProvider(symbolDetails, ctx, helper, helper /* as Logger */));
    }

    async loadChildren(contextId: string | null) {
        const topLevel: string[] = await this.sendCommand(new GetChildrenRunControlCommand(contextId)) || [];

        let result: string[] = [];
        for (const context of topLevel) {
            const children = await this.loadChildren(context);
            result.push(...children);
        }

        return [...topLevel, ...result];
    }

    async getThreads() {
        const contexts = await this.loadChildren(null);
        const results = [];
        for (const context of contexts) {
            const info: TCFContextData | null = await this.sendCommand(new GetContextRunControlCommand(context));
            if (info?.HasState) {
                const state: TCFStateData = await this.sendCommand(new GetStateRunControlCommand(context));
                // if (state.suspended) {
                results.push({ info, state });
                // }
            }
        }

        return results;
    }

    static async doEvery<I, O>(n: number, a: I[], f: (x: I[]) => Promise<O>): Promise<O[]> {
        let r = [];
        for (let i = 0; i < a.length; i += n) {
            let slice: I[] = a.slice(i, i + n);
            let o: O = await f(slice);

            r.push(o);
        }

        return r;
    }

    async sendChunkedCommand<I, O>(a: I[], f: (slice: I[]) => SimpleCommand<O[]>, n: number = DEFAULT_SEND_COMMAND_CHUNK_SIZE): Promise<O[]> {
        return (await TCFClient.doEvery(n, a, x => this.sendCommand(f(x))))
            .flat();
    }

    async getStackTrace(contextID: string, cancellationToken: CancellationFunction): Promise<{
        context: TCFContextDataStackTrace;
        mapToSource: TCFCodeAreaLineNumbers | undefined;
    }[]> {
        let children: string[] = await this.sendCommand(new GetChildrenStackTraceCommand(contextID)) || [];
        let childContexts: TCFContextDataStackTrace[] = await this.sendChunkedCommand(children, x => new GetContextStackTraceCommand(x));

        let result = [];

        outerfor:
        for (const childContext of childContexts) {
            if (cancellationToken()) {
                throw new InterruptedError("Cancelled");
            }
            if (childContext?.CodeArea) {
                const sourceLine = childContext?.CodeArea;
                if (sourceLine?.File && sourceLine?.SLine) {
                    result.push({ context: childContext, mapToSource: sourceLine });
                    //TODO: Note we are breaking early. It is possible we still need to get the symbol info to update the context Name (since this goes to the UI?)
                    continue outerfor;
                }
            }
            if (childContext?.IP) {
                try {
                    const symbol = await this.sendCommand(new FindByAddrSymbolsCommand(contextID, childContext.IP));
                    if (symbol) {
                        const symbolContext = await this.sendCommand(new GetContextSymbolsCommand(symbol));
                        if (symbolContext) {
                            if (symbolContext.TypeClass === TCFTypeClass.function) {
                                //XXX: hack: let's just replace the returned Name
                                //TODO: Get rid of the above hack and return this info properly... Not even entirely sure what it's supposed to do but presumably we display this Name in the VSCode stacktrace UI
                                if (symbolContext.Name) {
                                    childContext.Name = symbolContext.Name;
                                }
                            }

                        }
                    }
                } catch (e) {
                    console.log("Error " + JSON.stringify(e));
                }

                let sourceLines: TCFCodeAreaLineNumbers[] | null = await this.sendCommand(new MapToSourceLineNumbersCommand(contextID /*context.ParentID*/, childContext?.IP - 1, childContext?.IP));
                for (const sourceLine of sourceLines || []) {
                    if (sourceLine?.File && sourceLine?.SLine) {
                        result.push({ context: childContext, mapToSource: sourceLine });
                        continue outerfor;
                    }
                }
            }
            if (childContext?.RP) {
                let sourceLines: TCFCodeAreaLineNumbers[] | null = await this.sendCommand(new MapToSourceLineNumbersCommand(contextID /*context.ParentID*/, childContext?.RP - 1, childContext?.RP));
                for (const sourceLine of sourceLines || []) {
                    if (sourceLine?.File && sourceLine?.SLine) {
                        result.push({ context: childContext, mapToSource: sourceLine });
                        continue outerfor;
                    }
                }
            }

            //fallback
            result.push({ context: childContext, mapToSource: undefined });
        }

        return result;
    }

    /**
     *
     * @param buffers
     * @returns a list of buffers with the first 'error' buffer empty.
     */
    private static noError(buffers: Buffer[]): Buffer[] {
        return [Buffer.from([])].concat(buffers);
    }

    //see https://download.eclipse.org/tools/tcf/tcf-docs/TCF%20Service%20-%20Run%20Control.html#Events
    protected onRunControlEvent(event: string, datas: Buffer[]): void {
        switch (event) {
            case "contextChanged":
            case "contextAdded":
                parseResponse<TCFContextData[] | null>(TCFClient.noError(datas),
                    (results: TCFContextData[] | null) => {
                        if (results === null) {
                            return;
                        }
                        for (const resultData of results) {
                            this.contextInfo[resultData.ID] = resultData;
                        }
                    },
                    (err) => {
                        this.console.log(`Bad contextAdded event: ${JSON.stringify(err)}`);
                    },
                    json => asNullableArray(json, asTCFContextData));
                break;
            case "contextRemoved": //array of context IDs
                parseResponse<string[]>(TCFClient.noError(datas),
                    (removedContextIds) => {
                        for (const id of removedContextIds) {
                            delete this.contextInfo[id];
                        }
                    },
                    (err) => {
                        this.console.log(`Bad contextRemoved event: ${err}`);
                    }, asStringArray);
                break;
            case "contextSuspended":
                const info = parseContextSuspended(datas);
                this.console.received(`Got ${JSON.stringify(info)}`);

                if (info) {
                    this.onRunControlContextSuspended(info);
                } else {
                    this.console.log(`Bad contextSuspended event`);
                }
                break;
            case "contextResumed":
                if (!responseLengthAbout(1, datas)) {
                    this.console.error(`contextResumed response ignored: length unexpected. Should be 1 was ${datas.length}`);
                } else {
                    const contextID = asString(JSON.parse(datas[0].toString()));
                    this.onRunControlContextResumed(contextID);
                }
                break;
            case "contextException": //TODO: contextException
            case "containerSuspended": //TODO: containerSuspended
            case "containerResumed": //TODO: containerResumed
            case "contextStateChanged": //TODO: contextStateChanged
            default:
                this.console.log(`Unimplemented RunControl event: ${event}`);
                break;
        }
    }

    protected onRunControlContextSuspended(info: ContextSuspendedData) {
    }

    protected onRunControlContextResumed(contextID: string) {
    }

    protected abstract onBreakpoint(breakpointID: string, status: InstanceStatusData[]): void;
    protected abstract onBreakpointRemoved(breakpointIDs: string[]): void;
    protected abstract onBreakpointAdded(breakpointIDs: string[]): void;
    protected abstract onBreakpointChanged(breakpointIDs: string[]): void;

    protected onBreakpointsEvent(event: string, datas: Buffer[]): void {
        switch (event) {
            case "status":
                //either we have 2 chunks or 3 chunks with the last one empty...
                if (!responseLengthAbout(2, datas)) {
                    this.console.log(`Breakpoint status event data with unknown format`);
                    break;
                }
                const breakpointID = asString(JSON.parse(datas[0].toString()));
                const breakpointStatus = asBreakpointStatus(JSON.parse(datas[1].toString()));

                const goodInstances = (breakpointStatus?.Instances || [])
                    .filter(i => !i?.Error) //ignore breakpoints with errors
                    .filter(i => i?.LocationContext) //ignore those without location context
                    ;

                if (goodInstances.length > 0) {
                    //{"LocationContext":"P0:SLRT","HitCount":1,"Address":2147488952,"Size":1,"BreakpointType":"Software"}

                    this.console.log("Hit? breakpoint " + breakpointID + " at " + JSON.stringify(goodInstances));
                    this.onBreakpoint(breakpointID, goodInstances);
                } else {
                    this.console.log(`Eroneous breakpoint ${breakpointID} hit ${datas[1].toString()}`);
                }
                break;
            case "contextAdded":
                const breakpointsAdded = asNullableArray(JSON.parse(datas[0].toString()), asBreakpointData) || [];
                this.onBreakpointAdded(breakpointsAdded.map(b => b.ID));
                break;
            case "contextChanged":
                const breakpointsChanged = asNullableArray(JSON.parse(datas[0].toString()), asBreakpointData) || [];
                this.onBreakpointChanged(breakpointsChanged.map(b => b.ID));
                break;
            case "contextRemoved":
                const breakpointsRemoved = asStringArray(JSON.parse(datas[0].toString()));
                this.onBreakpointRemoved(breakpointsRemoved);
                break;
            default:
                this.console.log(`Unknown Breakpoints event: ${event}`);
                break;
        }
    }

    protected onLocatorEvent(event: string, datas: Buffer[]): void {
        switch (event) {
            case "peerHeartBeat":
                //ignore, so far. in theory we could remember the last timestamp and maybe reconnect if it's stale (or send our own heartbeat)
                break;
            default:
                this.console.log(`Unknown Locator event: ${event}`);
                break;
        }
    }

    //TODO: This design should be changed. Services should register their own event handler somehow then provide a way for the client to be notified...
    protected onEvent(service: string, event: string, datas: Buffer[]): void {
        switch (service) {
            case "RunControl":
                this.onRunControlEvent(event, datas);
                break;
            case "Breakpoints":
                this.onBreakpointsEvent(event, datas);
                break;
            case "Locator":
                this.onLocatorEvent(event, datas);
                break;
            default:
                this.console.log(`Unknown service event: ${service}.${event}`);
                break;
        }
    }
}
