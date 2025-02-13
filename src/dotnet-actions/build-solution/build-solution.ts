import * as path from "path";
import * as vscode from "vscode";

import {
  CustomTerminal,
} from "../../tools/output-channel";

async function buildSolution(command: string, cwd: string): Promise<void> {
  CustomTerminal().sendText(command);
}

async function BuildSolution(uri: vscode.Uri) {
  const currentSlnPath = uri.fsPath;
  const cwd = path.dirname(currentSlnPath);
  const command = `dotnet build "${currentSlnPath}"`;

  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Window,
      title: "Building Solution...",
      cancellable: false,
    },
    async (progress) => {
      try {
        await buildSolution(command, cwd);
      } catch (error: any) {}
    }
  );
}

export { BuildSolution };
