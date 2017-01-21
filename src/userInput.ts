'use strict'
import * as vscode from 'vscode'

export default class {
    private window = vscode.window;

    public getClientIP(): string {
        let res: string = "";
        this.window.showInputBox().then((input: string) => {
            console.log(input);
            if(input) res = input;
            // return input;
        })
        return res;
    }


}