import * as path from "path";
import * as vscode from "vscode";

import { CustomOutputChannel } from "../../tools/output-channel";
import { exec } from "child_process";

async function rebuildSolution(command: string, cwd: string): Promise<void> {
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

async function RebuildSolution(uri: vscode.Uri) {
    const currentSlnPath = uri.fsPath;
    const cwd = path.dirname(currentSlnPath);
    const cleanCommand = `dotnet clean "${currentSlnPath}"`;
    const buildCommand = `dotnet build "${currentSlnPath}"`;

    await vscode.window.withProgress(
        {
            location: vscode.ProgressLocation.Window,
            title: "Rebuilding Solution...",
            cancellable: false,
        },
        async (progress) => {
            try {
                progress.report({ message: "Cleaning solution..." });
                await rebuildSolution(cleanCommand, cwd);

                progress.report({ message: "Building solution..." });
                await rebuildSolution(buildCommand, cwd);

                CustomOutputChannel.appendLine("Build completed successfully!");
                vscode.window.showInformationMessage("Solution rebuilt successfully!");
            } catch (error: any) {
                CustomOutputChannel.appendLine(`Error building Solution: ${error.message}`);
                vscode.window.showErrorMessage("Error rebuilding solution. Check output for details.");
            }
        }
    );
}

export { RebuildSolution };
