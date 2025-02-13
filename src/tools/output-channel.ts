import * as vscode from 'vscode';

const CustomOutputChannel = vscode.window.createOutputChannel("vs-csharp-tools");
let _CustomTerminal: vscode.Terminal | undefined;

const CustomTerminal = ()=>{
    if (!_CustomTerminal || _CustomTerminal.exitStatus) {
        _CustomTerminal = vscode.window.createTerminal("vs-csharp-tools");
    }
    _CustomTerminal.show();
    return _CustomTerminal;
}; 

CustomOutputChannel.show();

export {CustomOutputChannel, CustomTerminal};