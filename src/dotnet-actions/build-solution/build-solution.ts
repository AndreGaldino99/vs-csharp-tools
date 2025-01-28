import * as path from "path";
import * as vscode from "vscode";

import { CustomOutputChannel } from "../../tools/output-channel";
import { exec } from "child_process";

async function buildSolution(command: string, cwd: string): Promise<void> {
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

async function BuildSolution(uri: vscode.Uri) {
    const currentSlnPath = uri.fsPath;
    const cwd = path.dirname(currentSlnPath);
    const command = `dotnet build "${currentSlnPath}"`;
    
    try {
        await buildSolution(command, cwd);
        CustomOutputChannel.appendLine("Build completed successfully!");
    } catch (error: any) {
        CustomOutputChannel.appendLine(`Error building solution: ${error.message}`);
    }
}

export { BuildSolution };
