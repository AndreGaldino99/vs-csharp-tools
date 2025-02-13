import * as path from "path";
import * as vscode from "vscode";

import {
  CustomTerminal,
} from "../../tools/output-channel";

async function buildProject(command: string, cwd: string): Promise<void> {
  CustomTerminal().sendText(command);
}

async function BuildProject(uri: vscode.Uri) {
  const currentCsprojPath = uri.fsPath;
  const cwd = path.dirname(currentCsprojPath);
  const command = `dotnet build "${currentCsprojPath}"`;

  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Window,
      title: "Building Project...",
      cancellable: false,
    },
    async (progress) => {
      try {
        await buildProject(command, cwd);
      } catch (error: any) {}
    }
  );
}

export { BuildProject };
