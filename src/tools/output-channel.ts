import * as vscode from 'vscode';

const CustomOutputChannel = vscode.window.createOutputChannel("vs-csharp-tools");
CustomOutputChannel.show();

export {CustomOutputChannel};