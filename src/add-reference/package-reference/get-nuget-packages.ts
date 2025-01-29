import * as vscode from "vscode";

import { CustomOutputChannel } from "../../tools/output-channel";
import { NugetPackagesType } from "./types";
import { error } from "console";

async function GetNugetPackages(q: string): Promise<NugetPackagesType | null> {
    if(q.length < 3)
        {
        CustomOutputChannel.appendLine("Enter at least 3 characters to search.");
        vscode.window.showInformationMessage("Enter at least 3 characters to search");
    }
    
    const url = `https://api-v2v3search-0.nuget.org/query?q=${encodeURIComponent(q)}&prerelease=true`;
    
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Request error');
        }
        
        const data: NugetPackagesType = await response.json() as NugetPackagesType;
        return data;
    } catch (error) {
        console.error('Error fetching NuGet packages:', error);
        return null;
    }
}

export {GetNugetPackages};