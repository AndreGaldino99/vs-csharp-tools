import * as fs from "fs/promises";
import * as path from "path";
import * as vscode from "vscode";

import {
  CustomOutputChannel,
  CustomTerminal,
} from "../../tools/output-channel";

import { GetNugetPackages } from "./get-nuget-packages";

async function findCsprojFiles(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const csprojFiles = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        return await findCsprojFiles(fullPath);
      } else if (entry.isFile() && entry.name.endsWith(".csproj")) {
        return [fullPath];
      } else {
        return [];
      }
    })
  );
  return csprojFiles.flat();
}

async function installNugetPackage(
  command: string,
  cwd: string
): Promise<void> {
  CustomTerminal().sendText(command);
}

async function AddPackageReference(uri: vscode.Uri) {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders) {
    CustomOutputChannel.appendLine("No workspace folder open.");
    return;
  }

  const solutionDir = workspaceFolders[0].uri.fsPath;
  const csprojFiles = await findCsprojFiles(solutionDir);

  if (csprojFiles.length === 0) {
    CustomOutputChannel.appendLine("No .csproj files found in the workspace.");
    return;
  }

  const currentCsprojPath = uri.fsPath;

  const packageName = await vscode.window.showInputBox({
    prompt: "Enter part of the NuGet package name",
    placeHolder: "e.g., Newtonsoft.Json",
  });

  if (!packageName) {
    CustomOutputChannel.appendLine("Package name is required.");
    return;
  }

  const nugetPackages = await GetNugetPackages(packageName);
  if (!nugetPackages || nugetPackages.totalHits === 0) {
    CustomOutputChannel.appendLine(
      `No NuGet packages found for "${packageName}".`
    );
    return;
  }

  const selectedPackage = await vscode.window.showQuickPick(
    nugetPackages.data.map((pkg) => ({
      label: pkg.id,
      description: `Latest version ${pkg.version}`,
      detail: pkg.description,
      data: pkg,
    })),
    {
      placeHolder: "Select a NuGet package to install",
    }
  );

  if (!selectedPackage) {
    CustomOutputChannel.appendLine("No package selected.");
    return;
  }

  const { id, versions } = selectedPackage.data;

  let selectedPackageVersions = versions.map((x) => x.version).reverse();

  if (selectedPackageVersions.length === 0) {
    CustomOutputChannel.appendLine(`No versions found for package "${id}".`);
    return;
  }

  const selectedVersion = await vscode.window.showQuickPick(
    selectedPackageVersions,
    {
      placeHolder: `Select a version for package "${id}"`,
    }
  );

  if (!selectedVersion) {
    CustomOutputChannel.appendLine("No version selected.");
    return;
  }

  const cwd = path.dirname(currentCsprojPath);
  const command = `dotnet add "${currentCsprojPath}" package ${id} --version ${selectedVersion}`;

  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: `Installing "${id} ${selectedVersion}"...`,
      cancellable: false,
    },
    async (progress) => {
      try {
        await installNugetPackage(command, cwd);
      } catch (error: any) {}
    }
  );
}

export { AddPackageReference };
