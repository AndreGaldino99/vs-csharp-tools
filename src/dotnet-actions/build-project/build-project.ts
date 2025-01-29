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
        console.error(data.toString());
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

async function BuildProject(uri: vscode.Uri) {
    const currentCsprojPath = uri.fsPath;
    const cwd = path.dirname(currentCsprojPath);
    const command = `dotnet build "${currentCsprojPath}"`;
    
    await vscode.window.withProgress(
        {
            location: vscode.ProgressLocation.Window,
            title: "Building Project...",
            cancellable: false,
        },
        async (progress) => {
            try {
                progress.report({ message: "Building project..." });
                await buildProject(command, cwd);
                
                CustomOutputChannel.appendLine("Build completed successfully!");
                vscode.window.showInformationMessage("Build completed successfully!");
            } catch (error: any) {
                CustomOutputChannel.appendLine(`Error building project: ${error.message}`);
                vscode.window.showInformationMessage(`Error building project: ${error.message}`);
            }
        });
    }
    
    export { BuildProject };
    