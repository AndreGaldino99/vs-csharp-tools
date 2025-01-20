import * as path from "path";
import * as vscode from "vscode";

import { exec } from "child_process";

async function cleanProject(command: string, cwd: string): Promise<void> {
    const childProcess = exec(command, { cwd });

    childProcess.stdout?.on("data", (data) => {
        vscode.window.showInformationMessage(data.toString());
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

async function CleanProject(uri: vscode.Uri) {
    const currentCsprojPath = uri.fsPath;
    const cwd = path.dirname(currentCsprojPath);
    const command = `dotnet clean "${currentCsprojPath}"`;
    
    try {
        await cleanProject(command, cwd);
        vscode.window.showInformationMessage("Clean completed successfully!");
    } catch (error: any) {
        vscode.window.showErrorMessage(`Error cleaning project: ${error.message}`);
    }
}

export { CleanProject };
