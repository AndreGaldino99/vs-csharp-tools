import * as vscode from "vscode";

import { Key, Languages } from "./types";

const labels: Languages[] = [{
    Key: "FailGetDotNetTemplate",
    Values: {
        English: "Failed to get dotnet templates",
        Spanish: "No se pudieron obtener las plantillas dotnet",
        Portuguese: "Falha ao obter modelos dotnet"
    }
}];

let language = vscode.env.language;

// Use {0}, {1}... to replace parameters
const formatMessage = (template: string, ...params: string[]): string => {
    return template.replace(/{(\d+)}/g, (match, index) => {
        return params[index] || match;
    });
};

const t = (key: Key, ...params: string[]) => {

    let message = labels.find(x => x.Key === key);

    if (message) {
        let template: string;
        switch (language) {
            case 'en':
                template = message.Values.English;
                break;
            case 'pt':
                template = message.Values.Portuguese;
                break;
            case 'es':
                template = message.Values.Spanish;
                break;
            default:
                template = message.Values.English;
                break;
        }
        return formatMessage(template, ...params);
    }

    return `Message for key '${key}' not found.`;
};

export { t };
