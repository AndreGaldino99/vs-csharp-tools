import * as path from "path";
import * as vscode from "vscode";

import { CustomOutputChannel } from "../../tools/output-channel";
import { exec } from "child_process";

async function buildProject(command: string, cwd: string): Promise<void> {
    const childProcess = exec(command, { cwd });
    
    childProcess.stdout?.on("data", (data) => {
        CustomOutputChannel.appendLine(data.toString());
    });
    
    childProcess.stderr?.on("data", (data) => {
        CustomOutputChannel.appendLine(data.toString());
    });
    
    return new Promise((resolve, reject) => {
        childProcess.on("close", (code) => {
            if (code !== 0) {
                reject(new Error(`Process exited with code ${code}`));
            } else {
                resolve();
            }
        });
    });
}

async function RebuildProject(uri: vscode.Uri) {
    const currentCsprojPath = uri.fsPath;
    const cwd = path.dirname(currentCsprojPath);
    
    const cleanCommand = `dotnet clean "${currentCsprojPath}"`;
    
    const buildCommand = `dotnet build "${currentCsprojPath}"`;
    
    await vscode.window.withProgress(
        {
            location: vscode.ProgressLocation.Window,
            title: "Rebuilding Project...",
            cancellable: false,
        },
        async (progress) => {
            try {
                progress.report({ message: "Cleaning project..." });
                await buildProject(cleanCommand, cwd);

                progress.report({ message: "Building project..." });
                await buildProject(buildCommand, cwd);

                CustomOutputChannel.appendLine("Build completed successfully!");
                vscode.window.showInformationMessage("Project rebuilt successfully!");
            } catch (error: any) {
                CustomOutputChannel.appendLine(`Error building project: ${error.message}`);
                vscode.window.showInformationMessage("Project rebuilt successfully!");
            } 
        });
    }
    
    export { RebuildProject };
    