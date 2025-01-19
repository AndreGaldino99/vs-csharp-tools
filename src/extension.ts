import * as vscode from 'vscode';

import { AddProjectReference } from "./add-reference/project-reference/add-project-reference";
import { AddDllReference } from './add-reference/dll-reference/add-dll-reference';
import { FileFormatter } from './file-formatter/file-formatter';

export function activate(context: vscode.ExtensionContext) {
	
	const addProjectReference = vscode.commands.registerCommand('vs-csharp-tools.addProjectReference', async (uri: vscode.Uri) => {
		await AddProjectReference(uri);
		setTimeout(() => {
			FileFormatter(uri.fsPath);
		}, 500);
	});
	
	const addDllReference = vscode.commands.registerCommand('vs-csharp-tools.addDllReference', async (uri: vscode.Uri) => {
		await AddDllReference(uri);
		setTimeout(() => {
			FileFormatter(uri.fsPath);
		}, 500);
	});
	
	context.subscriptions.push(addProjectReference);
	context.subscriptions.push(addDllReference);
}

export function deactivate() {}
