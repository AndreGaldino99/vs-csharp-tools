import * as path from "path";
import * as vscode from "vscode";

import { exec } from "child_process";

async function buildProject(command: string, cwd: string): Promise<void> {
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

async function BuildProject(uri: vscode.Uri) {
    const currentCsprojPath = uri.fsPath;
    const cwd = path.dirname(currentCsprojPath);
    const command = `dotnet build "${currentCsprojPath}"`;
    
    try {
        await buildProject(command, cwd);
        vscode.window.showInformationMessage("Build completed successfully!");
    } catch (error: any) {
        vscode.window.showErrorMessage(`Error building project: ${error.message}`);
    }
}

export { BuildProject };
