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
            description: pkg.version,
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

    const { id, version } = selectedPackage.data;
    const cwd = path.dirname(currentCsprojPath);
    const command = `dotnet add "${currentCsprojPath}" package ${id} --version ${version}`;

    try {
        await installNugetPackage(command, cwd);
        vscode.window.showInformationMessage(`Package "${id} ${version}" installed successfully.`);
    } catch (error: any) {
        vscode.window.showErrorMessage(`Error installing package: ${error.message}`);
    }
}

export { AddPackageReference };
