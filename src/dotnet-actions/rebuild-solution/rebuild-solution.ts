import * as path from "path";
import * as vscode from "vscode";

import {
  CustomTerminal
} from "../../tools/output-channel";

async function rebuildSolution(command: string, cwd: string): Promise<void> {
  CustomTerminal().sendText(command);
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
        await rebuildSolution(cleanCommand, cwd);

        await rebuildSolution(buildCommand, cwd);
      } catch (error: any) {}
    }
  );
}

export { RebuildSolution };
