import * as fs from "fs/promises";
import * as path from "path";
import * as vscode from "vscode";

import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

async function getDotnetTemplates(): Promise<string[][]> {
    try {
        const { stdout, stderr } = await execAsync("dotnet new list");
        if (stderr) {
            throw new Error(stderr);
        }
       
        const templates = parseDotnetNewList(stdout);
        templates.splice(0,2);
        
        return templates;
    } catch (error: any) {
        throw new Error(`Failed to get dotnet templates: ${error.message}`);
    }
}

async function createNewProject(template: string, solutionDir: string): Promise<void> {
    const projectName = await vscode.window.showInputBox({
        prompt: "Enter the name of the new project",
        placeHolder: "Project name",
    });
    
    if (!projectName) {
        vscode.window.showErrorMessage("Project name is required.");
        return;
    }
    
    const projectDir = path.join(solutionDir, projectName);
    const command = `dotnet new ${template} -o "${projectDir}"`;
    
    try {
        await execAsync(command);
        vscode.window.showInformationMessage(`Project '${projectName}' created successfully!`);
        
        
        const solutionFile = await findSolutionFile(solutionDir);
        if (solutionFile) {
            await execAsync(`dotnet sln "${solutionFile}" add "${projectDir}/${projectName}.csproj"`);
            vscode.window.showInformationMessage(`Project '${projectName}' added to solution.`);
        } else {
            vscode.window.showErrorMessage("Solution file (.sln) not found in the workspace.");
        }
    } catch (error: any) {
        vscode.window.showErrorMessage(`Error creating project: ${error.message}`);
    }
}

async function findSolutionFile(dir: string): Promise<string | null> {
    const files = await fs.readdir(dir);
    const solutionFiles = files.filter(file => file.endsWith(".sln"));
    return solutionFiles.length > 0 ? path.join(dir, solutionFiles[0]) : null;
}

async function AddNewProjectToSolution() {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        vscode.window.showErrorMessage("No workspace folder open.");
        return;
    }
    
    const solutionDir = workspaceFolders[0].uri.fsPath;
    
    try {
        const templates = await getDotnetTemplates();
        if (templates.length === 0) {
            vscode.window.showErrorMessage("No templates found.");
            return;
        }
        
        let list = templates.map(x => ({
            label: x[0],
            description: x[1],
            detail: x[3],
            data: x
        }));
        
        const selectedTemplate = await vscode.window.showQuickPick(list, {
            placeHolder: "Select a template for the new project",
        });
        
        if (selectedTemplate) {
            await createNewProject(selectedTemplate.description, solutionDir);
        }
    } catch (error: any) {
        vscode.window.showErrorMessage(`Error: ${error.message}`);
    }
}

function parseDotnetNewList(output: string): string[][] {
    const lines = output.split("\n");
    const result: string[][] = [];
    let startIndex = 1;
    
    for (let i = startIndex; i < lines.length; i++) {
        const line = lines[i].trim();
        
        if (!line) {continue;}; 
        
        const parts = line.split(/\s{2,}/); 
        if (parts.length >= 4) {
            const [templateName, shortName, language, tags] = parts;
            result.push([templateName.trim(), shortName.trim(), language.trim(), tags.trim()]);
        }
    }
    
    return result;
}

export { AddNewProjectToSolution };
