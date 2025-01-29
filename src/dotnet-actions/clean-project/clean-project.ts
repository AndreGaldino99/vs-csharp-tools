import * as path from "path";
import * as vscode from "vscode";

import { CustomOutputChannel } from "../../tools/output-channel";
import { exec } from "child_process";

async function cleanProject(command: string, cwd: string): Promise<void> {
    const childProcess = exec(command, { cwd });
    
    childProcess.stdout?.on("data", (data) => {
        CustomOutputChannel.appendLine(data.toString());
    });
    
    childProcess.stderr?.on("data", (data) => {
        CustomOutputChannel.appendLine(`Error: ${data.toString()}`);
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

async function CleanProject(uri: vscode.Uri) {
    const currentCsprojPath = uri.fsPath;
    const cwd = path.dirname(currentCsprojPath);
    const command = `dotnet clean "${currentCsprojPath}"`;
    
    await vscode.window.withProgress(
        {
            location: vscode.ProgressLocation.Window,
            title: "Cleaning project...",
            cancellable: false,
        },
        async (progress) => {
            try {
                progress.report({ message: "Cleaning project..." });
                await cleanProject(command, cwd);

                CustomOutputChannel.appendLine("Clean completed successfully!");
                vscode.window.showInformationMessage("Clean completed successfully!");
            } catch (error: any) {
                CustomOutputChannel.appendLine(`Error cleaning project: ${error.message}`);
                vscode.window.showInformationMessage(`Error cleaning project: ${error.message}`);
            }
        });
}

export { CleanProject };
