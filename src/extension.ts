import * as vscode from 'vscode';

import { AddDllReference } from './add-reference/dll-reference/add-dll-reference';
import { AddNewProjectToSolution } from './add-project/add-project';
import { AddPackageReference } from './add-reference/package-reference/add-package-reference';
import { AddProjectReference } from "./add-reference/project-reference/add-project-reference";
import { XmlFileFormatter } from './file-formatter/xml/xml-file-formatter';

export function activate(context: vscode.ExtensionContext) {
	
	const addProjectReference = vscode.commands.registerCommand('vs-csharp-tools.addProjectReference', async (uri: vscode.Uri) => {
		await AddProjectReference(uri);
		setTimeout(() => {
			XmlFileFormatter(uri.fsPath);
		}, 500);
	});
	
	const addDllReference = vscode.commands.registerCommand('vs-csharp-tools.addDllReference', async (uri: vscode.Uri) => {
		await AddDllReference(uri);
		setTimeout(() => {
			XmlFileFormatter(uri.fsPath);
		}, 500);
	});

	const addPackageReference = vscode.commands.registerCommand('vs-csharp-tools.addPackageReference', async (uri: vscode.Uri) => {
		await AddPackageReference(uri);
		setTimeout(() => {
			XmlFileFormatter(uri.fsPath);
		}, 500);
	});

	const addNewProjectToSolution = vscode.commands.registerCommand('vs-csharp-tools.addNewProjectToSolution', async (uri: vscode.Uri) => {
		await AddNewProjectToSolution();
		setTimeout(() => {
			XmlFileFormatter(uri.fsPath);
		}, 500);
	});
	
	context.subscriptions.push(addProjectReference);
	context.subscriptions.push(addDllReference);
	context.subscriptions.push(addPackageReference);
	context.subscriptions.push(addNewProjectToSolution);
}

export function deactivate() {}
