// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    let timeoutId: NodeJS.Timeout;
    // Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "at-saver" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
    const stopDisposable = vscode.commands.registerCommand('at-saver.stop', () => {
        // 拡張機能の動作を停止
        clearTimeout(timeoutId);
        vscode.window.showInformationMessage('at-saver stopped.');
    });
    const disposable = vscode.commands.registerCommand('at-saver', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const document = editor.document;

            let isDeleted = false;

            const randomInterval = () => Math.floor(Math.random() * (7 - 3 + 1) + 3) * 60 * 10;
            const position = editor.selection.active;
            const line = document.lineAt(position.line);
            const lineText = line.text;
            const executeTask = async () => {
                timeoutId = setTimeout(executeTask, randomInterval());
                if (isDeleted) {
                    editor.edit(editBuilder => {
                        editBuilder.insert(position, lineText);
                    });
                } else {
                    const range = new vscode.Range(line.range.start, line.range.end);
                    editor.edit(editBuilder => {
                        editBuilder.delete(range);
                    });
                }
                isDeleted = !isDeleted;
                // 1秒まつ
                await new Promise(resolve => setTimeout(resolve, 1000));
                document.save();

            };
            executeTask();
        }
    });

	context.subscriptions.push(disposable);
    context.subscriptions.push(stopDisposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
