import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";

async function AddDllReference(uri: vscode.Uri) {
  const dllUris = await vscode.window.showOpenDialog({
    canSelectFiles: true,
    canSelectFolders: false,
    filters: { "DLL Files": ["dll"] },
    openLabel: "Select one or more Dlls to add as reference",
    canSelectMany: true,
  });

  if (dllUris && dllUris.length > 0) {
    const csprojPath = uri.fsPath;
    const cwd = path.dirname(csprojPath);

    fs.readFile(csprojPath, "utf8", (err, data) => {
      if (err) {
        vscode.window.showErrorMessage(
          `Error reading .csproj file: ${err.message}`
        );
        return;
      }

      let updatedData = data;

      const itemGroupMatch = updatedData.match(
        /<ItemGroup>([\s\S]*?)<\/ItemGroup>/g
      );

      let dllItemGroup = itemGroupMatch?.find((itemGroup) =>
        itemGroup.includes("<Reference")
      );

      if (!dllItemGroup) {
        dllItemGroup = `
<ItemGroup>
</ItemGroup>`;
        updatedData = updatedData.replace(
          "</Project>",
          `${dllItemGroup}\n</Project>`
        );
      }

      let referencesXml = '';
      dllUris.forEach((dllUri) => {
        const selectedDll = dllUri.fsPath;
        const relativeDllPath = path.relative(cwd, selectedDll);

        if (!updatedData.includes(relativeDllPath)) {
          const referenceXml = `
  <Reference Include="${path.basename(selectedDll)}">
    <HintPath>${relativeDllPath}</HintPath>
  </Reference>`;
          
          referencesXml += referenceXml;
        } else {
          vscode.window.showInformationMessage(
            `The reference ${relativeDllPath} has already been added to ${csprojPath}`
          );
        }
      });

      if (referencesXml) {
        updatedData = updatedData.replace(
          dllItemGroup,
          `${dllItemGroup.replace(
            "</ItemGroup>",
            `${referencesXml}\n  </ItemGroup>`
          )}`
        );
      }

      fs.writeFile(csprojPath, updatedData, "utf8", (err) => {
        if (err) {
          vscode.window.showErrorMessage(
            `Error updating .csproj: ${err.message}`
          );
          return;
        }

        vscode.window.showInformationMessage(
          `DLL references successfully added to ${csprojPath}`
        );
      });
    });
  }
}

export { AddDllReference };
