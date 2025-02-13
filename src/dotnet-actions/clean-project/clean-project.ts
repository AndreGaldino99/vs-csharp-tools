import * as path from "path";
import * as vscode from "vscode";

import { CustomTerminal } from "../../tools/output-channel";

async function cleanProject(command: string, cwd: string): Promise<void> {
  CustomTerminal().sendText(command);
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
        await cleanProject(command, cwd);
      } catch (error: any) {}
    }
  );
}

export { CleanProject };
