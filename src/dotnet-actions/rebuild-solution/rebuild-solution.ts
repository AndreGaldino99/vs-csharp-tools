import * as path from "path";
import * as vscode from "vscode";

import { exec } from "child_process";

async function rebuildSolution(command: string, cwd: string): Promise<void> {
    const childProcess = exec(command, { cwd });

    childProcess.stdout?.on("data", (data) => {
        vscode.window.showInformationMessage(data.toString());
    });

    childProcess.stderr?.on("data", (data) => {
        vscode.window.showErrorMessage(data.toString());
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

async function RebuildSolution(uri: vscode.Uri) {
    const currentSlnPath = uri.fsPath;
    const cwd = path.dirname(currentSlnPath);

    const cleanCommand = `dotnet clean "${currentSlnPath}"`;

    const buildCommand = `dotnet build "${currentSlnPath}"`;

    try {
        
        await rebuildSolution(cleanCommand, cwd);
        await rebuildSolution(buildCommand, cwd);

        vscode.window.showInformationMessage("Build completed successfully!");
    } catch (error: any) {
        vscode.window.showErrorMessage(`Error building Solution: ${error.message}`);
    }
}

export { RebuildSolution };
