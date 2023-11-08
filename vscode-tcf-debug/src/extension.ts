/*
Copyright (C) 2022, 2023 Intel Corporation
SPDX-License-Identifier: MIT
*/
import * as vscode from 'vscode';
import { TCFDebugSession } from './debugProvider';
import { LoggingDebugSession } from '@vscode/debugadapter';
import { DebugProtocol } from '@vscode/debugprotocol';

export interface ActivateHook {
	activate(context: vscode.ExtensionContext): void;
}

export function activate(context: vscode.ExtensionContext) {
	void (vscode.window.showInformationMessage('TCF debugging extension is enabled.'));

	// debug-provider 
	context.subscriptions.push(vscode.debug.registerDebugConfigurationProvider('tcf', new TCFConfigurationProvider()));
	context.subscriptions.push(vscode.debug.registerDebugAdapterDescriptorFactory('tcf', new TCFDebugAdapterFactory()));

	//temporary migration message
	context.subscriptions.push(vscode.debug.registerDebugAdapterDescriptorFactory('vpu', new VPURenameDebugAdapterFactory()));

	//this is handy because it can be used in launch.json to be expanded via ${command:timestamp} in eg. record pcap paths
	context.subscriptions.push(vscode.commands.registerCommand('timestamp', () => {
		return new Date().toISOString()
			.replaceAll(":", "-"); //Windows does not like `:` in paths
	}));

	const s = "./extension-postactivate";
	import(s)
		.then((module) => {
			const h = module.default as ActivateHook;
			h.activate(context);
		}).catch(e => {
			//ignore
		});
}

export class VPURenameDebugAdapterFactory implements vscode.DebugAdapterDescriptorFactory {

	createDebugAdapterDescriptor(_session: vscode.DebugSession): vscode.ProviderResult<vscode.DebugAdapterDescriptor> {
		return new vscode.DebugAdapterInlineImplementation(new VPUDummyDebugSession());
	}
}

export class VPUDummyDebugSession extends LoggingDebugSession {

	protected initializeRequest(response: DebugProtocol.InitializeResponse, args: DebugProtocol.InitializeRequestArguments): void {
		this.sendErrorResponse(response, 0, "Extension configuration moved from `vpu` to `tcf`. Please edit your launch.json file");
	}
}

export class TCFDebugAdapterFactory implements vscode.DebugAdapterDescriptorFactory {

	createDebugAdapterDescriptor(_session: vscode.DebugSession): vscode.ProviderResult<vscode.DebugAdapterDescriptor> {
		//By default, path mapper execution is *enabled*. The workspace is already trusted so a default 'false' value only ruins the debugging experience.
		const pathMapperConfigDefault = vscode.workspace.getConfiguration("tcf").inspect("executePathMapper")?.defaultValue ?? true;
		const pathMapperConfig = vscode.workspace.getConfiguration("tcf").get('executePathMapper', pathMapperConfigDefault);

		const enablePathMapper =
			//technically, isTrusted is always true since a debugging extension will not be enabled in an untrusted workspace
			vscode.workspace.isTrusted
			&& pathMapperConfig === true;
		return new vscode.DebugAdapterInlineImplementation(new TCFDebugSession(enablePathMapper));
	}
}

export class TCFConfigurationProvider implements vscode.DebugConfigurationProvider {

	/**
	 * Massage a debug configuration just before a debug session is being launched,
	 * e.g. add all missing attributes to the debug configuration.
	 */
	resolveDebugConfiguration(folder: vscode.WorkspaceFolder | undefined, config: vscode.DebugConfiguration, token?: vscode.CancellationToken): vscode.ProviderResult<vscode.DebugConfiguration> {

		// if launch.json is missing or empty
		if (!config.type && !config.request && !config.name) {
			const editor = vscode.window.activeTextEditor;
			if (editor && (editor.document.languageId === 'cpp' || editor.document.languageId === 'c')) {
				config.type = 'tcf';
				config.name = 'Launch';
				config.request = 'launch';
			}
		}

		return config;
	}
}

export function deactivate() {
	// handled by context.subscriptions
}
