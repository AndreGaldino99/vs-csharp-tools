import * as path from "path";
import * as vscode from "vscode";

import { CustomOutputChannel } from "../../tools/output-channel";
import { exec } from "child_process";

async function cleanSolution(command: string, cwd: string): Promise<void> {
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

async function CleanSolution(uri: vscode.Uri) {
    const currentSqlPath = uri.fsPath;
    const cwd = path.dirname(currentSqlPath);
    const command = `dotnet clean "${currentSqlPath}"`;
    
    await vscode.window.withProgress(
        {
            location: vscode.ProgressLocation.Window,
            title: "Cleaning Solution...",
            cancellable: false,
        },
        async (progress) => {
            try {
                progress.report({ message: "Cleaning solution..." });
                await cleanSolution(command, cwd);

                CustomOutputChannel.appendLine("Clean completed successfully!");
                vscode.window.showInformationMessage("Clean completed successfully!");
            } catch (error: any) {
                CustomOutputChannel.appendLine(`Error cleaning Solution: ${error.message}`);
                vscode.window.showInformationMessage(`Error cleaning Solution: ${error.message}`);
            }
        });
    }
    
    export { CleanSolution };
    