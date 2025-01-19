import * as path from "path";
import * as vscode from "vscode";
import * as fs from "fs/promises";
import { exec } from "child_process";
import { promisify } from "util";
import { GetNugetPackages } from "./get-nuget-packages";  

const execAsync = promisify(exec);

async function findCsprojFiles(dir: string): Promise<string[]> {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const csprojFiles = await Promise.all(entries.map(async (entry) => {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            return await findCsprojFiles(fullPath);
        } else if (entry.isFile() && entry.name.endsWith(".csproj")) {
            return [fullPath];
        } else {
            return [];
        }
    }));
    return csprojFiles.flat();
}

async function installNugetPackage(command: string, cwd: string): Promise<void> {
    const { stderr } = await execAsync(command, { cwd });
    if (stderr) {
        return Promise.reject(new Error(stderr));
    }
}

async function AddPackageReference(uri: vscode.Uri) {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        vscode.window.showErrorMessage("No workspace folder open.");
        return;
    }

    const solutionDir = workspaceFolders[0].uri.fsPath;
    const csprojFiles = await findCsprojFiles(solutionDir);

    if (csprojFiles.length === 0) {
        vscode.window.showErrorMessage("No .csproj files found in the workspace.");
        return;
    }

    const currentCsprojPath = uri.fsPath;
    
    const packageName = await vscode.window.showInputBox({
        prompt: "Enter part of the NuGet package name",
        placeHolder: "e.g., Newtonsoft.Json",
    });

    if (!packageName) {
        vscode.window.showErrorMessage("Package name is required.");
        return;
    }

    const nugetPackages = await GetNugetPackages(packageName);
    if (!nugetPackages || nugetPackages.totalHits === 0) {
        vscode.window.showErrorMessage(`No NuGet packages found for "${packageName}".`);
        return;
    }
    
    const selectedPackage = await vscode.window.showQuickPick(
        nugetPackages.data.map(pkg => ({
            label: pkg.id,
            description: `Latest version ${pkg.version}`,
            detail: pkg.description,
            data: pkg,
        })),
        {
            placeHolder: "Select a NuGet package to install",
        }
    );

    if (!selectedPackage) {
        vscode.window.showErrorMessage("No package selected.");
        return;
    }

    const { id, versions  } = selectedPackage.data;

    let selectedPackageVersions = versions.map(x=>x.version).reverse();
    
    if (selectedPackageVersions.length === 0) {
        vscode.window.showErrorMessage(`No versions found for package "${id}".`);
        return;
    }

    const selectedVersion = await vscode.window.showQuickPick(selectedPackageVersions, {
        placeHolder: `Select a version for package "${id}"`,
    });

    if (!selectedVersion) {
        vscode.window.showErrorMessage("No version selected.");
        return;
    }

    const cwd = path.dirname(currentCsprojPath);
    const command = `dotnet add "${currentCsprojPath}" package ${id} --version ${selectedVersion}`;

    await vscode.window.withProgress(
        {
            location: vscode.ProgressLocation.Notification,
            title: `Installing "${id} ${selectedVersion}"...`,
            cancellable: false,
        },
        async (progress) => {
            progress.report({ increment: 0, message: "Installing..." });
            
            try {
                await installNugetPackage(command, cwd);
                vscode.window.showInformationMessage(`Package "${id} ${selectedVersion}" installed successfully.`);
            } catch (error: any) {
                vscode.window.showErrorMessage(`Error installing package: ${error.message}`);
            }
        }
    );
}

export { AddPackageReference };