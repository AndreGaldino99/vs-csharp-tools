import { NugetPackagesType } from "./types";
import * as vscode from "vscode";

async function GetNugetPackages(q: string): Promise<NugetPackagesType | null> {
    if(q.length < 3)
        {
        vscode.window.showErrorMessage("Enter at least 3 characters to search.");
        throw "Enter at least 3 characters to search";
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