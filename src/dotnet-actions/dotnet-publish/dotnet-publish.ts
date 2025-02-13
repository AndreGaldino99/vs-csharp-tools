import * as path from "path";
import * as vscode from "vscode";

import {
  CustomOutputChannel,
  CustomTerminal,
} from "../../tools/output-channel";

async function publishProject(command: string, cwd: string): Promise<void> {
  CustomTerminal().sendText(command);
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

  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Window,
      title: "Publishing Solution...",
      cancellable: false,
    },
    async (progress) => {
      try {
        await publishProject(command, cwd);
      } catch (error: any) {}
    }
  );
}

export { PublishProject };
