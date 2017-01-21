'use strict'
import * as vscode from 'vscode';

export default class editManager {
    private editor: vscode.TextEditor;

    constructor() {
       this.editor = vscode.window.activeTextEditor
    }

    public setText(textToSet: string): boolean {
        var allTextRange = new vscode.Range(new vscode.Position(0, 0), this.editor.document.lineAt(this.editor.document.lineCount - 1).range.end);
        var editorText = this.editor.document.getText(allTextRange);
        // TextEditor.setText(otText);
        this.editor.edit(function (textEditorEdit) {
            return textEditorEdit.replace(allTextRange, textToSet);
        }).then(function (didReplace: boolean) {
            // console.log("didReplace", didReplace);
            return didReplace;
        });
        return false;
    }

    public getText(): string {
        return this.editor.document.getText();
    }
}