import * as vscode from 'vscode';

import { AddProjectReference } from "./add-reference/project-reference/add-project-reference";
import { AddDllReference } from './add-reference/dll-reference/add-dll-reference';

export function activate(context: vscode.ExtensionContext) {

	const addProjectReference = vscode.commands.registerCommand('vs-csharp-tools.addProjectReference', async (uri: vscode.Uri) => {
		AddProjectReference(uri);
	});

	const addDllReference = vscode.commands.registerCommand('vs-csharp-tools.addDllReference', async (uri: vscode.Uri) => {
		AddDllReference(uri);
	});

	context.subscriptions.push(addProjectReference);
	context.subscriptions.push(addDllReference);
}

export function deactivate() {}
