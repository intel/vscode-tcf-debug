/*
Copyright (C) 2022, 2023 Intel Corporation
SPDX-License-Identifier: MIT
*/
import * as path from 'path';
import * as fsPromises from 'fs/promises';
import {
	LoggingDebugSession, logger, Thread, InitializedEvent,
	OutputEvent, StoppedEvent, StackFrame, Source, Scope, Variable,
	TerminatedEvent,
	ContinuedEvent,
	BreakpointEvent,
	Breakpoint
} from '@vscode/debugadapter';
import { DebugProtocol } from '@vscode/debugprotocol';
import {
	TCFLogger, TCFClient, InstanceStatusData, pcapCreate,
	GetStatusBreakpointsCommand, GetPropertiesBreakpointsCommand, GetIDsBreakpointsCommand,
	TCFTypeClass,
	MapToMemoryLineNumbersCommand, MapToSourceLineNumbersCommand,
	ContextSuspendedData,
	NEVER_CANCELLED,
	CancellationFunction,
	InterruptedError,
	TimeoutError,
	JSONValidationError,
	ClientVariable,
	DebugCommandStamper,
	SmallCommandStamper,
} from './tcf-all';
import { promises } from 'fs';
import { LifetimeDebugSession } from './lifetimeDebugSession';
import * as validateLauchRequestArguments from './validators/validate-TCFLaunchRequestArguments';
import { DisassembleDisassemblyCommand, DisassemblyParameters, GetCapabilitiesDisassemblyCommand } from './tcf/disassembly';
import { MockFlags } from './mocksocket';
import { MappedLoader, PathLoader } from './loader';
import { Repl, ReplProvider } from './repl';
import { GetChildrenRegistersCommand, GetContextRegistersCommand, GetRegistersCommand } from './tcf/registers';

export interface InternalLaunchArguments {
	/**
	 * Show TCF messages in the debug console
	 */
	debugTCFMessages?: boolean;
	/**
	 * Normally TCF command tokens are very terse identifiers which make manually reading the TCF messages hard.
	 * If this property is set to `debug` a more verbose command token is used which makes the reply easier to
	 * understand.
	 *
	 * @default "default"
	 */
	commandToken?: "debug" | "default";
}

//see https://code.visualstudio.com/api/references/contribution-points#contributes.debuggers
//see package.json configurationAttributes which is the JSON schema (aka TCFLaunchRequestArguments.json) for this object
//Note that '$ref' is not supported by vscode so it must be generated like this (--refs = false):
// npx typescript-json-schema --required ./tsconfig.json --refs false TCFLaunchRequestArguments  -o src/schema/TCFLaunchRequestArguments.json
// then
// npx ajv compile --code-lines --allowUnionTypes -s src/schema/TCFLaunchRequestArguments.json -o src/validators/validate-TCFLaunchRequestArguments.js
// npx tsc --allowJs --declaration --emitDeclarationOnly ./src/validators/*js  --outDir ./src/validators/
export interface TCFLaunchRequestArguments extends DebugProtocol.LaunchRequestArguments {
	/**
	 * (Remote) TCF agent host
	 * @default "localhost"
	 */
	host?: string;
	/**
	 * TCF connection port
	 * @default 1534
	 */
	port?: number;
	/** File path where TCF messages will be recorded into */
	record?: string;
	/** File path with recorded TCF message which will be used to replay TCF messages (host and port will be ignored) */
	playback?: string;
	playbackFlag?: MockFlags;
	/**
	 * Debug commands timeout (milliseconds)
	 * @default 10000
	 */
	timeout?: number;
	/**
	 * Show TCF messages in the debug console
	 * @deprecated use internal.debugTCFMessages
	 */
	debugTCFMessages?: boolean;
	breakpointPrefix?: string;
	/**
	 * A Javascript function to map a local path to the debugger path
	 * @default "return function (path, context) { return path; }"
	 */
	pathMapper?: string;
	internal?: InternalLaunchArguments;
	/**
	 * Maximum number of stack frames that a stackTrace can have. Unlimited, if not defined.
	 */
	stackTraceDepth?: number;
}

export function asLaunchRequestArguments(result: any): TCFLaunchRequestArguments {
	const validResult = validateLauchRequestArguments(result);
	if (!validResult) {
		const validationErrors = (validateLauchRequestArguments as any).errors;
		throw new JSONValidationError(validationErrors, result);
	}
	return result as TCFLaunchRequestArguments; //type assertion OK
}

const DEFAULT_TCF_HOST = "localhost";
const DEFAULT_TCF_PORT = 1534;
const DEFAULT_DEBUG_TCF_MESSAGES = false;

class DebugLogger implements TCFLogger {
	parent: LoggingDebugSession;
	debugTCF: boolean = DEFAULT_DEBUG_TCF_MESSAGES;
	prefix = "";

	constructor(parent: LoggingDebugSession) {
		this.parent = parent;
	}

	setDebugTCFMessages(debugTCF: boolean) {
		this.debugTCF = debugTCF;
	}

	setPrefix(p: string) {
		this.prefix = p;
	}

	private time(): string {
		let d: Date = new Date();

		return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;
	}

	received(message: string): void {
		if (this.debugTCF) {
			this.log(message);
		}
	}

	sent(message: string): void {
		if (this.debugTCF) {
			this.error(message);
		}
	}

	log(message: string): void {
		this.parent.sendEvent(new OutputEvent(this.prefix + this.time() + " " + message + "\n", "console"));
	}

	error(message: string): void {
		this.parent.sendEvent(new OutputEvent(this.prefix + this.time() + " " + message + "\n", "out"));
	}

	stdout(message: string): void {
		this.parent.sendEvent(new OutputEvent(message, "stdout"));
	}
}

enum ErrorCodes {
	continueError,
	nextError,
	stepInError,
	stepOutError,
	pauseError,
	stackTraceError,
	watchError,
	disassemblyError,
	evaluateError,
}

//see https://microsoft.github.io/debug-adapter-protocol/specification#Events_Stopped
enum StoppedEventReason {
	breakpoint = "breakpoint",
	pause = "pause"
}

enum BreakpointEventReason {
	removed = "removed",
	added = "new",
	changed = "changed"
}

const COULD_NOT_CONNECT_MESSAGE_ID = 1;

const DEFAULT_BREAKPOINTS_PREFIX = "emi-";
const BREAKPOINT_INVALID = -1;

class BreakpointTuple {
	id: number; //unique
	line: number;
	file: string;
	verified: boolean = false;

	constructor(id: number, line: number, file: string) {
		this.id = id;
		this.line = line;
		this.file = file;
	}
}

class BreakpointsManager {
	configured = false;
	counter = 0;
	breakpoints: Map<string, Map<number, BreakpointTuple>> = new Map();
	breakpointsById: Map<number, BreakpointTuple> = new Map();

	deleteID(breakpointID: number) {
		const b = this.breakpointsById.get(breakpointID);
		if (b === undefined) {
			return; //not known?
		}
		this.breakpointsById.delete(breakpointID);
		const map = this.breakpoints.get(b.file);
		if (map === undefined) {
			return; //can't happen?
		}
		map.delete(b.line);
	}

	deleteLine(path: string, line: number) {
		const map = this.breakpoints.get(path);
		if (map === undefined) {
			return; //not known?
		}
		const b = map.get(line);
		if (b === undefined) {
			return;
		}
		this.breakpointsById.delete(b.id);
		map.delete(line);
	}

	addTuple(id: number, line: number, file: string) {
		const tuple = new BreakpointTuple(id, line, file);
		this.breakpointsById.set(id, tuple);
		this.getFileBreakpoints(file).set(line, tuple);
	}

	/**
	 * @returns sorted array of files with breakpoints
	 */
	getFiles() {
		return Array.from(this.breakpoints.keys()).sort();
	}

	private getFileBreakpoints(path: string): Map<number, BreakpointTuple> {
		let fileBreakpoints = this.breakpoints.get(path);
		if (fileBreakpoints === undefined) {
			fileBreakpoints = new Map();
			this.breakpoints.set(path, fileBreakpoints);
		}

		return fileBreakpoints;
	}

	getBreakpoints(path: string): Map<number, BreakpointTuple> | undefined {
		return this.breakpoints.get(path);
	}

	/**
	 * @returns the breakpoint IDs added and removed (or disabled)
	 */
	updateBreakpointIds(path: string, lines: number[]): { added: { lines: number[], id: number[] }, removed: number[] } {
		let fileBreakpoints = this.getFileBreakpoints(path);
		const existingLines = new Set(fileBreakpoints.keys());
		const newLines = new Set(lines);

		const addedLines = [...newLines].filter(v => !existingLines.has(v));
		const removedLines = [...existingLines].filter(v => !newLines.has(v));

		const removedIds = removedLines.map((v) => fileBreakpoints.get(v)?.id || /* impossible */ -1);
		//update breakpoints
		removedLines.forEach(line => this.deleteLine(path, line));

		const addedIds: number[] = [];
		addedLines.forEach(line => {
			const id = this.counter++;
			addedIds.push(id);

			//update breakpoints
			this.addTuple(id, line, path);
		});

		if (this.configured) {
			//return incremental changes
			return { added: { lines: addedLines, id: addedIds }, removed: removedIds };
		} else {
			//return nothing, will return bulk list when configuration is done
			return { added: { lines: [], id: [] }, removed: [] };
		}
	}

	setVerified(breakpointID: number): void {
		let b = this.breakpointsById.get(breakpointID);
		if (b === undefined) {
			//XXX: log? unknown breakpoint
			return;
		}

		b.verified = true;
	}

	//NOTE: This is the last call after all the breakpoints have been set according to
	// https://microsoft.github.io/debug-adapter-protocol/overview#configuring-breakpoint-and-exception-behavior
	configurationDone() {
		this.configured = true;
	}

}

export class TCFDebugSession extends LifetimeDebugSession {

	protected self = this;
	//the first threadsRequest seems important because no StoppedEvent can be sent without VSCode knowing the thread IDs...
	protected firstThreadsRequest: boolean = true;
	protected threadIdToContext = new Map<number, string>();
	//Keep the same thread ID for the same context for the duration of this debug session. A key added here is never removed / changed.
	protected contextToThreadId = new Map<string, number>();

	protected enabledPathMapper: boolean;
	protected stackTraceDepth: number = -1; // unlimited

	getOrAssignThreadId(context: string): number {
		let threadId = this.contextToThreadId.get(context);
		if (threadId === undefined) {
			threadId = this.contextToThreadId.size + 1;
			this.contextToThreadId.set(context, threadId);
		}

		return threadId;
	}

	breakpointsManager = new BreakpointsManager();
	breakpointPrefix: string = DEFAULT_BREAKPOINTS_PREFIX;

	pathMapper: (path: string, context?: any) => string = (s) => s;

	tcfLogger = new DebugLogger(this);

	private tcfClient = new class extends TCFClient {
		outer: TCFDebugSession;

		constructor(logger: TCFLogger, outer: TCFDebugSession) {
			super(logger, new SmallCommandStamper());
			this.outer = outer;
		}

		setCommandToken(kind: string) {
			switch (kind) {
				case "debug":
					this.tokenIdGenerator = new DebugCommandStamper();
					break;
				default:
					//we just leave the default (and maybe create another instance here...)
					this.tokenIdGenerator = new SmallCommandStamper();
					break;
			}
		}

		//TODO: this should return boolean and let the caller present the info
		async verifyInlinedBreakpoint(context: string, breakpointID: string) {
			//So... we do not keep track of what breakpoints we actually have. Let's ask then.
			//TODO: keep internal list of breakpoints
			const data = await this.sendCommand(new GetPropertiesBreakpointsCommand(breakpointID));
			if (!data) {
				return;
			}

			if (data.File && data.Line) {
				const z = await this.sendCommand(new MapToMemoryLineNumbersCommand(context, data.File, data.Line, 1)); //columns starts at 1
				if (!z) {
					this.console.error(`Possibly inlined breakpoint hit on ${context} for ${data.File}:${data.Line}`);
				}
				if (z && z.length === 1) { //XXX: Not sure what to do if null or more results are returned. probably doesn't matter
					const start = z[0].SAddr || -1;
					const end = z[0].EAddr || -1;
					//Reverse verify line number based on address
					const lineNumbers = await this.sendCommand(new MapToSourceLineNumbersCommand(context, start, end)) || [];
					if (lineNumbers && lineNumbers.length === 0) {
						this.console.error(`Possibly inlined breakpoint hit on ${context} for ${data.File}:${data.Line}`);
					}
				}
			}
		}

		protected onBreakpointRemoved(breakpointIDs: string[]): void {
			for (const id of breakpointIDs) {
				const dapID = this.outer.breakpointTcfIdToId(id);
				const event = new BreakpointEvent(BreakpointEventReason.removed, {
					id: dapID,
					verified: false
				} as DebugProtocol.Breakpoint);
				this.outer.sendEvent(event);

				if (dapID !== BREAKPOINT_INVALID) {
					this.outer.breakpointsManager.deleteID(dapID);
				}
			}
		}

		protected onBreakpointAdded(breakpointIDs: string[]): void {
			for (const id of breakpointIDs) {
				const dapID = this.outer.breakpointTcfIdToId(id);
				const event = new BreakpointEvent(BreakpointEventReason.changed, { //not "added" because it already exists
					id: dapID,
					verified: true
				} as DebugProtocol.Breakpoint);
				this.outer.sendEvent(event);

				if (dapID !== BREAKPOINT_INVALID) {
					this.outer.breakpointsManager.setVerified(dapID);
				}
			}
		}

		protected onBreakpointChanged(breakpointIDs: string[]): void {
			for (const id of breakpointIDs) {
				const dapID = this.outer.breakpointTcfIdToId(id);
				const event = new BreakpointEvent(BreakpointEventReason.changed, {
					id: dapID,
					verified: true
				} as DebugProtocol.Breakpoint);
				this.outer.sendEvent(event);

				if (dapID !== BREAKPOINT_INVALID) {
					this.outer.breakpointsManager.setVerified(dapID);
				}
			}
		}

		protected onBreakpoint(breakpointTcfId: string, status: InstanceStatusData[]): void {
			const breakpointID = this.outer.breakpointTcfIdToId(breakpointTcfId);
			if (breakpointID === BREAKPOINT_INVALID) {
				this.console.log(`Unknown breakpoint ${breakpointID}. Ignoring`); //TODO: maybe instead of ignoring it should send a generic stoppedEvent?
				return;
			}
			const contexts = new Set(status.filter(x => x.LocationContext).map(x => x.LocationContext));
			if (contexts.size !== 1) {
				//note sure what more than a single context hit means: multiple threads stopped at once?
				//TODO: log unexpected situation?
				this.console.log(`Same breakpoint hit on multiple contexts (threadIds)!`);
				return;
			}

			// contexts.size === 1
			//single context hit, find the corresponding threadId
			const context = contexts.values().next().value;

			void (this.verifyInlinedBreakpoint(context, breakpointTcfId)); //TODO: Should this be await-ed instead of ignored with the void operator?

			//NOTE: *If* we don't know the thread ID, it may be a new thread or we have never had a threadsRequest.
			// So, we assign a new threadId and hope VSCode will get a Thread instance with this id when it calls threadRequest
			// (see the request waterfall on https://microsoft.github.io/debug-adapter-protocol/overview#stopping-and-accessing-debuggee-state )
			const event = new StoppedEvent(StoppedEventReason.breakpoint, this.outer.getOrAssignThreadId(context));
			this.outer.sendEvent(event);
		}

		protected onRunControlContextSuspended(info: ContextSuspendedData) {
			this.outer.onRunControlContextSuspended(info.id);
		}

		protected onRunControlContextResumed(contextID: string) {
			this.outer.onRunControlContextResumed(contextID);
		}

		protected onSocketError(err: any): void {
			this.outer.onSocketError(err);
		}

		protected onEvent(service: string, event: string, datas: Buffer[]): void {
			if (this.outer.onHandledEvent(service, event, datas)) {
				return;
			}
			super.onEvent(service, event, datas);
		}

	}(this.tcfLogger, this);

	constructor(enablePathMapper: boolean = false) {
		super();
		this.enabledPathMapper = enablePathMapper;
	}

	/* test only */ getTcfClient() : TCFClient {
		return this.tcfClient;
	}

	protected onHandledEvent(service: string, event: string, datas: Buffer[]): boolean {
		let handled = false;
		this.repls.forEach(r => {
			if (handled) {
				//already found a match, do nothing.
				return;
			}
			if (r.handledEvent(service, event, datas)) {
				handled = true;
				//TODO: can't break a for each, maybe not the best API?
				return;
			}
		});
		return handled;
	}

	protected initializeRequest(response: DebugProtocol.InitializeResponse, args: DebugProtocol.InitializeRequestArguments): void {
		response.body = response.body || {};

		response.body.supportsCancelRequest = true;
		response.body.supportsConfigurationDoneRequest = true;
		response.body.supportsSteppingGranularity = true;
		response.body.supportSuspendDebuggee = true;
		response.body.supportTerminateDebuggee = true;
		response.body.supportsSingleThreadExecutionRequests = true; //we can pause/resume a single CPU, surely?
		response.body.supportsDisassembleRequest = true;

		this.tcfLogger.log("TCF debug session initialized");

		this.sendResponse(response);
	}

	protected async launchRequestAsync(response: DebugProtocol.LaunchResponse, args: TCFLaunchRequestArguments) {
		this.tcfLogger.log("Launch request " + args);

		try {
			asLaunchRequestArguments(args);
		} catch (e) {
			this.tcfLogger.error(`Incorrect launch configuration, error ${e}`);
			this.sendErrorResponse(response, 1, "Incorrect launch configuration.");
			return;
		}

		const host = args.host || DEFAULT_TCF_HOST;
		const port = args.port || DEFAULT_TCF_PORT;
		this.breakpointPrefix = args.breakpointPrefix ?? DEFAULT_BREAKPOINTS_PREFIX;

		if (args.pathMapper !== undefined && args.pathMapper !== "") {
			if (this.enabledPathMapper) {
				try {
					const f = new Function(args.pathMapper);
					this.pathMapper = f();
					this.tcfLogger.log(`Trusted workspace has custom path mapper function which will be executed.`);
				} catch (e) {
					this.tcfLogger.error(`Could not load pathMapper, error ${e}`);
				}
			} else {
				this.tcfLogger.error(`⚠️️ Ignoring path mapper function because it is not enabled in settings.`);
			}
		}
		if (args.timeout !== undefined) {
			this.tcfClient.setCommandTimeout(args.timeout);
		}
		if (args.record) {
			try {
				const lstat = await fsPromises.lstat(args.record);
				if (lstat.isSymbolicLink()) {
					this.tcfLogger.error(`Ignoring record file ${args.record} because it is a symlink!`);
				} else {
					this.tcfClient.setPcapFile(pcapCreate(args.record));
				}
			} catch (err: unknown) {
				this.tcfClient.setPcapFile(pcapCreate(args.record));
			}
		}
		if (args.playback) {
			this.tcfLogger.setPrefix("⚠️️️⏪⚠️️");
			this.tcfClient.playback(args.playback, args.playbackFlag);
		} else {
			this.tcfLogger.setPrefix("");

		}
		if (args.stackTraceDepth !== undefined && args.stackTraceDepth > 0) {
			this.stackTraceDepth = args.stackTraceDepth;
		}
		this.tcfLogger.setDebugTCFMessages(args.debugTCFMessages || (args.internal?.debugTCFMessages || DEFAULT_DEBUG_TCF_MESSAGES));
		if (args.internal?.commandToken) {
			this.tcfClient.setCommandToken(args.internal.commandToken);
		}
		try {
			await this.tcfClient.connect(host, port);

			this.sendResponse(response);
			this.sendEvent(new InitializedEvent());
		} catch (err) {
			this.sendErrorResponse(response, {
				id: COULD_NOT_CONNECT_MESSAGE_ID,
				format: "Could not connect to {host}:{port}.\n({err})",
				variables: {
					"host": host,
					"port": String(port),
					"err": String(err)
				}
			});
		}
	}

	protected async configurationDoneRequestAsync(response: DebugProtocol.ConfigurationDoneResponse, args: DebugProtocol.ConfigurationDoneArguments) {
		//NOTE: This is the last call after all the breakpoints have been set according to
		// https://microsoft.github.io/debug-adapter-protocol/overview#configuring-breakpoint-and-exception-behavior
		this.breakpointsManager.configurationDone();

		const breakpoints = this.breakpointsManager.getFiles().map(file => {
			const b = this.breakpointsManager.getBreakpoints(file);
			if (!b) {
				return []; //shouldn't happen?
			}
			const sortedLines = Array.from(b.keys()).sort();
			const ids = sortedLines.map(line => b.get(line)?.id ?? /* impossible */ -2).map(v => this.breakpointIdToTcfId(v));
			const data = this.tcfClient.createBreakpoints(this.convertClientPathToDebugger(file), sortedLines, ids);
			return data;
		}).flat();
		await this.tcfClient.setBreakpointsList(breakpoints);

		this.sendResponse(response);
	}

	//helper function to do a cancellable call
	private async asCancellable(request: DebugProtocol.Request | undefined, task: (c: CancellationFunction) => any, error: (e: any) => void) {
		let cancellationToken = NEVER_CANCELLED;
		if (request) {
			this.ongoingPromises.add(request.seq);
			cancellationToken = () => !this.ongoingPromises.has(request.seq);
		}

		try {
			await task(cancellationToken);
		} catch (e) {
			//console.log(e);
			if (e instanceof InterruptedError) {
				//ignore
			} else {
				error(e);
			}
		} finally {
			if (request?.seq) {
				// console.log(`Removing finished request ${request.seq}`);
				this.ongoingPromises.delete(request.seq);
			}
		}
	}

	protected async stackTraceRequest(response: DebugProtocol.StackTraceResponse, args: DebugProtocol.StackTraceArguments, request?: DebugProtocol.StackTraceRequest) {
		await this.asCancellable(request, async (cancellationToken) => {
			await this._stackTraceRequest(response, args, request, cancellationToken);
		}, (e) => {
			let message: string;
			if (e instanceof TimeoutError) {
				message = "timeout";
			} else {
				message = JSON.stringify(e);
			}
			this.sendErrorResponse(response, ErrorCodes.stackTraceError, `Getting stack trace failed (${message})`);
		});
	}

	// This is just an initial map<address number as string, context id>.
	// It's not necessarily good as a map since VSCode may increment while scrolling the address and thus make valid requests
	// using addresses that are not in this map. Still, it's good enough for basic disassembly support.
	stackMemoryRefence: Map<string, string> = new Map();

	protected async _stackTraceRequest(response: DebugProtocol.StackTraceResponse, args: DebugProtocol.StackTraceArguments, request?: DebugProtocol.StackTraceRequest, cancellationToken: CancellationFunction = NEVER_CANCELLED) {
		const contextID = this.threadIdToContext.get(args.threadId);
		if (!contextID) {
			console.log(`Unknown context ID for thread #${args.threadId}`);

			this.sendResponse(response);
			return;
		}
		const contextData = await this.tcfClient.getStackTrace(contextID, cancellationToken, this.stackTraceDepth);

		this.stackMemoryRefence.clear(); //get rid of old context IDs and addresses
		let stackFrames = [];

		for (const c of contextData) {
			let source = undefined;
			if (c.mapToSource?.File) {
				let stackPath;
				if (c.mapToSource.Dir) {
					const separator = c.mapToSource.Dir.includes(path.posix.sep) ? path.posix.sep : path.sep;
					stackPath = c.mapToSource.Dir + separator + c.mapToSource.File;
				} else {
					stackPath = c.mapToSource.File;
				}
				const filePath = this.convertDebuggerPathToClient(stackPath);

				//UI tweak: to avoid long paths, only add the full path when it's actually on disk on the user machine. otherwise show just the file name with no path
				try {
					await promises.stat(filePath);
					//we asume file exists, try to find the name
					const realpath = await promises.realpath(filePath);
					const fileName = path.basename(realpath);
					source = new Source(fileName, filePath);
				} catch (err) {
					//we assume file does not exist, show just the file name we got
					const fileName = path.basename(filePath);
					source = new Source(fileName, filePath);
				}

			}
			const s = new StackFrame(
				this.createNextStackFrameId(args.threadId, c.context),
				c.context.Name || c.context.ID,
				source,
				c.mapToSource?.SLine,
				c.mapToSource?.SCol);
			if (c.context.IP) {
				s.instructionPointerReference = String(c.context.IP);
				this.stackMemoryRefence.set(String(c.context.IP), contextID); //Note the context is *not* c.context.ID which is something else
			}
			stackFrames.push(s);
		}

		response.body = {
			stackFrames,
			totalFrames: contextData.length
		};

		this.sendResponse(response);
	}


	protected async threadsRequestAsync(response: DebugProtocol.ThreadsResponse, request?: DebugProtocol.Request) {
		// console.log("Got threadRequest " + JSON.stringify(request));

		let cancellationToken = () => false;
		if (request) {
			this.ongoingPromises.add(request.seq);
			cancellationToken = () => !this.ongoingPromises.has(request.seq);
		}

		const tcfData = await this.tcfClient.getThreads();

		if (cancellationToken()) {
			return;
		}

		//TODO: this.threadIds.clear();

		let suspendedEvents: DebugProtocol.StoppedEvent[] = []; //send suspended events for each suspended thread
		let id = 0;
		const threads = [];

		for (const x of tcfData) {
			const context = x.info.ID;
			const details = x.state.suspended ? x.state.lastStateReason : "Running";
			const threadID = this.getOrAssignThreadId(context);
			const thread = new Thread(threadID, `${x.info.Name}`);// : ${details}`);
			this.threadIdToContext.set(threadID, context);

			if (x.state.suspended) {
				const reason = x.state.lastStateReason?.includes("Breakpoint") ? StoppedEventReason.breakpoint : StoppedEventReason.pause; //it is possible the TCF event tells us it was a breakpoint. Use that to have a better reason.
				const e: DebugProtocol.StoppedEvent = new StoppedEvent(reason);
				e.body.description = details ?? undefined;
				e.body.threadId = thread.id;
				suspendedEvents.push(e);

				if (reason === StoppedEventReason.breakpoint) {
					try {
						const breakpointID = await this.findBreakpoint(x.info.ID, x.state.pc);
						if (cancellationToken()) {
							// console.log("Token cancelled");
							return;
						} else {
							await this.tcfClient.verifyInlinedBreakpoint(x.info.ID, breakpointID);
						}
					} catch (e) {
						console.log("Ignorable errror " + JSON.stringify(e));
					}
				}
			}

			threads.push(thread);
		}

		response.body = {
			threads
		};

		console.log(`Sending (first=${this.firstThreadsRequest}) thread response ${JSON.stringify(response)} (synthetic suspended events ${suspendedEvents.length})`);
		this.sendResponse(response);

		if (this.firstThreadsRequest) {
			for (let i = 0; i < suspendedEvents.length; i++) {
				this.sendEvent(suspendedEvents[i]);
			}
		}
		this.firstThreadsRequest = false;
		this.ongoingPromises.delete(request?.seq || -1); //TODO: this should be a finally
	}

	private async findBreakpoint(context: string, pc: number): Promise<string> {
		const ids = await this.tcfClient.sendCommand(new GetIDsBreakpointsCommand());

		for (const id of ids) {
			const status = await this.tcfClient.sendCommand(new GetStatusBreakpointsCommand(id));

			const found = (status?.Instances || []).some(s => ("" + s?.Address) === ("" + pc));

			if (found) {
				return id;
			}
		}

		throw new Error("Breakpoint for pc not found");
	}

	/**
	 * @param id TCF breakpoint ID
	 * @returns vscode breakpoint ID or BREAKPOINT_INVALID if not a valid breakpoint
	 * @see this.breakpointIdToTcfId
	 */
	private breakpointTcfIdToId(id: string): number {
		if (!id.startsWith(this.breakpointPrefix)) {
			return BREAKPOINT_INVALID;
		}
		return Number(id.substring(this.breakpointPrefix.length));
	}

	/**
	 * @param id vscode breakpoint ID
	 * @returns TCF breakpoint ID
	 * @see this.breakpointTcfIdToId
	 */
	private breakpointIdToTcfId(id: number) {
		return this.breakpointPrefix + String(id);
	}

	protected async setBreakPointsRequestAsync(response: DebugProtocol.SetBreakpointsResponse, args: DebugProtocol.SetBreakpointsArguments): Promise<void> {
		const path = args.source.path as string;
		//TODO: Note we are using args.lines (which is deprecated) instead of the more rich args.breakpoints but except column value for
		// breakpoints we don't support any of the other breakpoint features (supportsConditionalBreakpoints, supportsHitConditionalBreakpoints, supportsLogPoints)
		const clientLines = args.lines || [];

		this.sendEvent(new OutputEvent("Set breakpoints for " + path, "console"));

		const idInfo = this.breakpointsManager.updateBreakpointIds(path, clientLines);
		await this.tcfClient.addBreakpoints(this.convertClientPathToDebugger(path), idInfo.added.lines, idInfo.added.id.map(v => this.breakpointIdToTcfId(v)));
		await this.tcfClient.removeBreakpoints(idInfo.removed.map(v => this.breakpointIdToTcfId(v)));

		const currentBreakpoints = this.breakpointsManager.getBreakpoints(path);

		response.body = {
			breakpoints: clientLines.map(line => {
				//NOTE: by default all new breakpoints are unverified. Based on events they become verified and this info is saved in breakpointsManager.
				const b = new Breakpoint(false, line);
				const tuple = currentBreakpoints?.get(line);
				if (tuple !== undefined) {
					b.setId(tuple.id);
					b.verified = tuple.verified;
				} else {
					//shouldn't happen
					console.log(`Unknown breakpoint ID for line ${line} on path ${path}`);
				}

				return b;
			})
		};
		this.sendResponse(response);
	}

	protected async pauseRequest(response: DebugProtocol.PauseResponse, args: DebugProtocol.PauseArguments, request?: DebugProtocol.Request): Promise<void> {
		try {
			const threadName = this.threadIdToContext.get(args.threadId);
			if (!threadName) {
				this.sendErrorResponse(response, ErrorCodes.pauseError, `Pause failed. Unknown thread ${args.threadId}`);
				return;
			}

			this.sendResponse(response);

			await this.tcfClient.pause(threadName);
		} catch (e) {
			this.sendErrorResponse(response, ErrorCodes.pauseError, "Pause failed");
		}
	}

	//see https://microsoft.github.io/debug-adapter-protocol/specification#Requests_Pause
	private onRunControlContextSuspended(contextID: string) {
		// this.tcfClient.sendCommand(new GetStateRunControlCommand(threadName));

		const threadId = this.getOrAssignThreadId(contextID);
		const e: DebugProtocol.StoppedEvent = new StoppedEvent(StoppedEventReason.pause, threadId);
		//Note there's also e.body.allThreadsStopped but... we can't know that
		this.sendEvent(e);
		//once suspended we can use object references for this threadId
		this.onThreadSuspended(threadId);
	}

	protected async continueRequest(response: DebugProtocol.ContinueResponse, args: DebugProtocol.ContinueArguments): Promise<void> {
		//TODO: we could support args.singleThread and args.threadId easily...
		try {
			let contextID: string | undefined = undefined;
			if (args.singleThread || args.threadId) { //TODO: here only if(args.singleThread) should be used...
				contextID = this.threadIdToContext.get(args.threadId);
				if (!contextID) {
					logger.error(`Cound not continue unknown thread ${args.threadId}, continuing all of them`);
					this.sendErrorResponse(response, ErrorCodes.pauseError, `Pause failed. Unknown thread ${args.threadId}`);
					return;
				}
			}
			await this.tcfClient.continue(contextID);
			//TODO: body is undefined, probably because it's only defined when args.singleThread is there?
			response.body = { allThreadsContinued: (contextID === undefined) };
			this.sendResponse(response);
		} catch (e) {
			this.sendErrorResponse(response, ErrorCodes.continueError, "Continue command failed");
		}
	}

	protected async nextRequestAsync(response: DebugProtocol.NextResponse, args: DebugProtocol.NextArguments, request?: DebugProtocol.Request | undefined): Promise<void> {
		let contextID = this.threadIdToContext.get(args.threadId);
		//TODO: handle args.singleThread
		if (!contextID) {
			logger.error(`Cound not continue unknown thread ${args.threadId}, continuing all of them`);
			this.sendErrorResponse(response, ErrorCodes.nextError, `Next step failed. Unknown thread ${args.threadId}`);
			return;
		}
		switch (args.granularity) {
			case 'instruction':
				await this.tcfClient.nextInstruction(contextID);
				break;
			case 'line':
				await this.tcfClient.next(contextID);
				break;
			default:
				//note granularity may be undefined here
				if (args.granularity) {
					logger.error(`Will execute step over with 'line' granularity even if ${args.granularity} was requested; TCF does not support this granularity`);
				}
				await this.tcfClient.next(contextID);
				break;
		}
		this.sendResponse(response);
	}

	protected async stepInRequestAsync(response: DebugProtocol.StepInResponse, args: DebugProtocol.StepInArguments, request?: DebugProtocol.Request): Promise<void> {
		let contextID = this.threadIdToContext.get(args.threadId);
		//TODO: handle args.singleThread
		if (!contextID) {
			logger.error(`Cound not continue unknown thread ${args.threadId}, ignore the call`);
			this.sendErrorResponse(response, ErrorCodes.stepInError, `Step in failed. Unknown thread ${args.threadId}`);
			return;
		}
		if (args.granularity && args.granularity !== "line") {
			logger.error(`Will execute step in with 'line' granularity even if ${args.granularity} was requested; TCF does not support this granularity`);
		}
		await this.tcfClient.stepIn(contextID);
		this.sendResponse(response);
	}

	protected async stepOutRequestAsync(response: DebugProtocol.StepOutResponse, args: DebugProtocol.StepOutArguments, request?: DebugProtocol.Request): Promise<void> {
		let contextID = this.threadIdToContext.get(args.threadId);
		//TODO: handle args.singleThread
		if (!contextID) {
			logger.error(`Could not continue unknown thread ${args.threadId}, ignore the call`);
			this.sendErrorResponse(response, ErrorCodes.stepOutError, `Step out failed. Unknown thread ${args.threadId}`);
			return;
		}
		if (args.granularity && args.granularity !== "line") {
			logger.error(`Will execute step out with 'line' granularity even if ${args.granularity} was requested; TCF does not support this granularity`);
		}
		await this.tcfClient.stepOut(contextID);
		this.sendResponse(response);
	}

	protected onRunControlContextResumed(contextID: string) {
		const threadId = this.getOrAssignThreadId(contextID);
		const e: DebugProtocol.ContinuedEvent = new ContinuedEvent(threadId, false);
		//Note we assume allThreadsContinued is false
		this.sendEvent(e);
		this.onThreadResumed(threadId);
	}

	repls: MappedLoader<ReplProvider, Repl> = new MappedLoader(new PathLoader("./repl"), s => s.create(this.tcfClient, this.tcfLogger));

	protected async evaluateRequestAsync(response: DebugProtocol.EvaluateResponse, args: DebugProtocol.EvaluateArguments, request?: DebugProtocol.Request | undefined): Promise<void> {
		switch (args.context) {
			case "watch":
				await this.evaluateWatchRequest(response, args, request);
				break;
			case "repl":
				let repl = await this.repls.get(args.context);
				if (repl !== undefined) {
					await repl.evaluateRequest(response, args, request);
					this.sendResponse(response);
				} else {
					this.sendErrorResponse(response, ErrorCodes.evaluateError, `No repl handler`);
				}
				break;
			default:
				this.sendErrorResponse(response, ErrorCodes.evaluateError, `Unknown context ${args.context}`);
				break;
		}
	}

	private async evaluateWatchRequest(response: DebugProtocol.EvaluateResponse, args: DebugProtocol.EvaluateArguments, request?: DebugProtocol.Request | undefined): Promise<void> {
		if (args.frameId === undefined) {
			// TODO: According to the spec a missing frameId means global scope. Implement this in the future. 
			// See https://microsoft.github.io/debug-adapter-protocol/specification#Requests_Evaluate
			this.tcfLogger.error(`Watch failed. Global scope watch not supported yet.`);
			this.sendErrorResponse(response, ErrorCodes.watchError, `Global scope watch not supported!`);
			return;
		}

		let [ctx, stack] = this.getStackFrameDetails(args.frameId);
		try {
			const vars = await this.tcfClient.getStackVariables(ctx, stack);
			const v = vars.find((el) => el.name() === args.expression);

			if (v === undefined) {
				this.tcfLogger.error(`Could not watch ${args.expression}, ignore the call`);
				this.sendResponse(response);
				return;
			}

			const dVariable = await this.getDebugVariableFromClientVariable(v, args.frameId);
			response.body = {
				result: dVariable.value,
				type: dVariable.type,
				variablesReference: dVariable.variablesReference
			};
			this.sendResponse(response);
		} catch (e) {
			this.sendErrorResponse(response, ErrorCodes.watchError, "Error " + JSON.stringify(e));
		}
	}

	protected async getDebugVariableFromClientVariable(clientVariable: ClientVariable, frameId: number): Promise<DebugProtocol.Variable> {
		try {
			//TODO: they type should be (recursively) decoded too
			const variableType = clientVariable.type.Name || TCFTypeClass[clientVariable.type.TypeClass || TCFTypeClass.unknown] || "";
			//const variableInfo = this.decodeVariableValue(variableName, v);
			const r = new Variable(clientVariable.name() ?? "", await clientVariable.displayValue() || "");
			const rd = r as DebugProtocol.Variable;
			if (clientVariable.isRegister()) {
				//not sure how to best present the fact that this variable is stored in a register...
				rd.presentationHint = {
					visibility: 'internal'
				};
			}
			rd.type = variableType;
			const children = await clientVariable.getChildren();
			rd.indexedVariables = children?.length; //TODO: a smaller method childrenSize may help here

			if (children && children.length > 0) {
				const subreference = this.createSubVariableReference(frameId, children);
				r.variablesReference = subreference;
			}
			return r;
		} catch (e) {
			return new Variable(clientVariable.name() ?? "err", String(e));
		}
	}

	protected scopesRequest(response: DebugProtocol.ScopesResponse, args: DebugProtocol.ScopesArguments): void {
		let localsScope = new Scope("Locals", this.getLocalScopeVariableReference(args.frameId), false);
		(localsScope as DebugProtocol.Scope).presentationHint = 'locals'; //XXX: Why is the casting necessary here?

		let registersScope = new Scope("Registers", this.getRegisterScopeVariableReference(args.frameId), false);
		(registersScope as DebugProtocol.Scope).presentationHint = 'registers'; //XXX: Why is the casting necessary here?

		response.body = {
			scopes: [
				localsScope,
				registersScope
			]
		};
		this.sendResponse(response);
	}

	protected async variablesRequestAsync(response: DebugProtocol.VariablesResponse, args: DebugProtocol.VariablesArguments, request?: DebugProtocol.Request): Promise<void> {
		//TODO: add support for the args filtering, start and count.

		if (this.isSubVariableReference(args.variablesReference)) {
			const info = this.getSubVariable(args.variablesReference); //TODO: Introduce getSubVariable(start, length, reference) so only the needed vars are (lazy) loaded
			if (info) {
				let vars = [];
				for (let i = args.start || 0, c = 0; i < info.length && c < (args.count || Number.MAX_VALUE); c++, i++) {
					const v = info[i];
					const r = new Variable(v.name() || "", await v.displayValue() || "");
					const rd = r as DebugProtocol.Variable;
					//rd.type = variableType;
					const children = await v.getChildren();
					rd.indexedVariables = children?.length; //TODO: a smaller method childrenSize may help here

					if (children && children.length > 0) {
						const subreference = this.createSubVariableReference(args.variablesReference, children);
						r.variablesReference = subreference;
					}

					vars.push(r);
				}
				response.body = {
					variables: vars
				};
			}
			this.sendResponse(response);
			return;
		}

		let [ctx, stack] = this.getStackFrameDetails(args.variablesReference);

		if (this.isRegisterScopeVariableReference(args.variablesReference)) {
			//registers!

			//TODO: add recursion, we could have a whole tree of registers
			const regs = await this.tcfClient.sendCommand(new GetChildrenRegistersCommand(ctx));

			if (regs) {
				const rctxs = await Promise.all(regs.map(r => this.tcfClient.sendCommand(new GetContextRegistersCommand(r))));
				const rvalues = await Promise.all(regs.map(r => this.tcfClient.sendCommand(new GetRegistersCommand(r))));

				let vars = [];
				for (let i = 0; i < regs.length; i++) {
					const name = rctxs[i]?.Name ?? `Register ${regs[i]}`;
					const value = "0x" + rvalues[i].toString("hex");
					const v = new Variable(name, value);
					vars.push(v);
				}
				response.body = {
					variables: vars
				};
			}

			this.sendResponse(response);
			return;
		}

		try {
			const vars = await this.tcfClient.getStackVariables(ctx, stack);

			const resultVars = [];
			for (const v of vars) {
				if (v.name() === undefined) {
					continue;
				}

				resultVars.push(await this.getDebugVariableFromClientVariable(v, args.variablesReference));
			}

			response.body = {
				variables: resultVars
			};
			this.sendResponse(response);
		} catch (e) {
			logger.error("Error " + JSON.stringify(e));
		}
	}

	protected async disassembleRequestAsync(response: DebugProtocol.DisassembleResponse, args: DebugProtocol.DisassembleArguments, request?: DebugProtocol.Request | undefined): Promise<void> {
		if (args.instructionOffset) {
			//TODO: Implement, if possible, disassembly offset support.
		}
		const contextID = this.stackMemoryRefence.get(args.memoryReference);
		if (contextID === undefined) {
			this.sendErrorResponse(response, ErrorCodes.disassemblyError, "Unknown memory reference (not a stack)");
			return;
		}
		const capabilities = await this.tcfClient.sendCommand(new GetCapabilitiesDisassemblyCommand(contextID));
		if (capabilities === null || capabilities.length === 0) {
			this.sendResponse(response); //maybe send error?
			return;
		}

		const disassemblyLines = await this.tcfClient.sendCommand(new DisassembleDisassemblyCommand(contextID, Number(args.memoryReference) + (args.offset ?? 0), args.instructionCount, { //XXX: Note we assume the memory reference is a number...
			/* eslint-disable @typescript-eslint/naming-convention */
			ISA: capabilities[0].ISA,
			//Not sure what to send here, so let's do false for all
			Simplified: false,
			PseudoInstructions: false,
			OpcodeValue: false
			/* eslint-enable */
		} as DisassemblyParameters));

		if (disassemblyLines === null) {
			this.sendResponse(response); //maybe send error?
			return;
		}

		response.body = {
			instructions: disassemblyLines.map(l => {
				return {
					address: String(l.Address),
					instruction: l.Instruction !== null ? l.Instruction[0].Text : "NULL", //what does it mean to have more instructions per address?
				} as DebugProtocol.DisassembledInstruction;
			})
		};
		this.sendResponse(response);
	}

	protected disconnectRequest(response: DebugProtocol.DisconnectResponse, args: DebugProtocol.DisconnectArguments, request?: DebugProtocol.Request | undefined): void {
		this.repls.forEach(r => {
			r.disconnect();
		});
		this.tcfClient.disconnect();
		this.sendResponse(response);
	}

	private ongoingPromises = new Set<number>();

	protected cancelRequest(response: DebugProtocol.CancelResponse, args: DebugProtocol.CancelArguments, request?: DebugProtocol.Request): void {
		// console.log("Cancelled request " + request);
		if (args.requestId) {
			const removed = this.ongoingPromises.delete(args.requestId);
			if (!removed) {
				console.log(`Cancelled request unmanaged request id ${args.requestId}`);
			}
		}
		this.sendResponse(response);
	}

	protected onSocketError(err: any): void {
		this.tcfClient.console.error(`Connection error ${err}`);
		this.sendEvent(new TerminatedEvent());
		this.tcfClient.disconnect();
	}


	debugToClientMap = new Map<string, string>();

	protected convertDebuggerPathToClient(debuggerPath: string): string {
		//TODO: this method could do the inverse string transformations as convertClientPathToDebugger
		// but until then we just use the hash map and see if it's a previosly seen path
		const p = this.debugToClientMap.get(debuggerPath);

		if (p) {
			return p;
		}
		//fallback: unknown path
		return debuggerPath;
	}

	/**
	 * Convert VSCode file path to a debugger / DWARF path.
	 * 
	 * @param clientPath VSCode path
	 * @returns a debugger path
	 */
	protected convertClientPathToDebugger(clientPath: string): string {
		const p = this.pathMapper(clientPath);
		this.debugToClientMap.set(p, clientPath);
		return p;
	}
}
