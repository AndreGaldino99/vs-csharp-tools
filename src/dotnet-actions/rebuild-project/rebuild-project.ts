import * as path from "path";
import * as vscode from "vscode";

import { CustomTerminal } from "../../tools/output-channel";

async function buildProject(command: string, cwd: string): Promise<void> {
  CustomTerminal().sendText(command);
}

async function RebuildProject(uri: vscode.Uri) {
  const currentCsprojPath = uri.fsPath;
  const cwd = path.dirname(currentCsprojPath);

  const cleanCommand = `dotnet clean "${currentCsprojPath}"`;

  const buildCommand = `dotnet build "${currentCsprojPath}"`;

  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Window,
      title: "Rebuilding Project...",
      cancellable: false,
    },
    async (progress) => {
      try {
        await buildProject(cleanCommand, cwd);

        await buildProject(buildCommand, cwd);
      } catch (error: any) {}
    }
  );
}

export { RebuildProject };
