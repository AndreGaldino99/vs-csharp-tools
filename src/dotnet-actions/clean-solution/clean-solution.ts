import * as path from "path";
import * as vscode from "vscode";

import {
  CustomOutputChannel,
  CustomTerminal,
} from "../../tools/output-channel";

async function cleanSolution(command: string, cwd: string): Promise<void> {
  CustomTerminal().sendText(command);
}

async function CleanSolution(uri: vscode.Uri) {
  const currentSqlPath = uri.fsPath;
  const cwd = path.dirname(currentSqlPath);
  const command = `dotnet clean "${currentSqlPath}"`;

  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Window,
      title: "Cleaning Solution...",
      cancellable: false,
    },
    async (progress) => {
      try {
        await cleanSolution(command, cwd);
      } catch (error: any) {}
    }
  );
}

export { CleanSolution };
