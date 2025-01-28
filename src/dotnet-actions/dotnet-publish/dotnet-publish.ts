import * as path from "path";
import * as vscode from "vscode";

import { CustomOutputChannel } from "../../tools/output-channel";
import { exec } from "child_process";

async function publishProject(command: string, cwd: string): Promise<void> {
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

async function PublishProject(uri: vscode.Uri) {
    const currentCsprojPath = uri.fsPath;
    const cwd = path.dirname(currentCsprojPath);

    const folderUri = await vscode.window.showOpenDialog({
        canSelectFolders: true,
        canSelectFiles: false,
        openLabel: "Select Destination Folder",
    });

    if (!folderUri || folderUri.length === 0) {
        CustomOutputChannel.appendLine("No folder selected. Publish canceled.");
        return;
    }

    const destinationFolder = folderUri[0].fsPath;

    const command = `dotnet publish "${currentCsprojPath}" -o "${destinationFolder}"`;

    try {
        await publishProject(command, cwd);
        CustomOutputChannel.appendLine("Publish completed successfully!");
    } catch (error: any) {
        CustomOutputChannel.appendLine(`Error publishing project: ${error.message}`);
    }
}

export { PublishProject };
