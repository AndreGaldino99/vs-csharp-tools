import * as path from "path";
import * as vscode from "vscode";

import { exec } from "child_process";

async function cleanSolution(command: string, cwd: string): Promise<void> {
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

async function CleanSolution(uri: vscode.Uri) {
    const currentSqlPath = uri.fsPath;
    const cwd = path.dirname(currentSqlPath);
    const command = `dotnet clean "${currentSqlPath}"`;
    
    try {
        await cleanSolution(command, cwd);
        vscode.window.showInformationMessage("Clean completed successfully!");
    } catch (error: any) {
        vscode.window.showErrorMessage(`Error cleaning Solution: ${error.message}`);
    }
}

export { CleanSolution };
