import * as vscode from 'vscode';

import { AddDllReference } from './add-reference/dll-reference/add-dll-reference';
import { AddNewProjectToSolution } from './add-project/add-project';
import { AddPackageReference } from './add-reference/package-reference/add-package-reference';
import { AddProjectReference } from "./add-reference/project-reference/add-project-reference";
import { BuildProject } from './dotnet-actions/build-project/build-project';
import { BuildSolution } from './dotnet-actions/build-solution/build-solution';
import { CleanProject } from './dotnet-actions/clean-project/clean-project';
import { CleanSolution } from './dotnet-actions/clean-solution/clean-solution';
import { PublishProject } from './dotnet-actions/dotnet-publish/dotnet-publish';
import { RebuildProject } from './dotnet-actions/rebuild-project/rebuild-project';
import { RebuildSolution } from './dotnet-actions/rebuild-solution/rebuild-solution';
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
	
	const buildProject = vscode.commands.registerCommand('vs-csharp-tools.buildProject', async (uri: vscode.Uri) => {
		BuildProject(uri);
	});
	
	const rebuildProject = vscode.commands.registerCommand('vs-csharp-tools.rebuildProject', async (uri: vscode.Uri) => {
		RebuildProject(uri);
	});
	
	const cleanProject = vscode.commands.registerCommand('vs-csharp-tools.cleanProject', async (uri: vscode.Uri) => {
		CleanProject(uri);
	});
	
	const publishProject = vscode.commands.registerCommand('vs-csharp-tools.publishProject', async (uri: vscode.Uri) => {
		PublishProject(uri);
	});

	const buildSolution = vscode.commands.registerCommand('vs-csharp-tools.buildSolution', async (uri: vscode.Uri) => {
		BuildSolution(uri);
	});
	
	const rebuildSolution = vscode.commands.registerCommand('vs-csharp-tools.rebuildSolution', async (uri: vscode.Uri) => {
		RebuildSolution(uri);
	});
	
	const cleanSolution = vscode.commands.registerCommand('vs-csharp-tools.cleanSolution', async (uri: vscode.Uri) => {
		CleanSolution(uri);
	});
	
	context.subscriptions.push(addProjectReference);
	context.subscriptions.push(addDllReference);
	context.subscriptions.push(addPackageReference);
	context.subscriptions.push(addNewProjectToSolution);
	context.subscriptions.push(buildProject);
	context.subscriptions.push(rebuildProject);
	context.subscriptions.push(cleanProject);
	context.subscriptions.push(publishProject);	
	context.subscriptions.push(buildSolution);
	context.subscriptions.push(rebuildSolution);
	context.subscriptions.push(cleanSolution);
}

export function deactivate() {}
