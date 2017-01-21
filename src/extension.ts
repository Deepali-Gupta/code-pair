'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import editManager from './editManager'

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "codepair" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.sayHello', () => {
        // The code you place here will be executed every time your command is executed
       
        // Display a message box to the user
        vscode.window.showInformationMessage('Hello World!');
       
    });
    let disposableSend = vscode.commands.registerCommand('extension.send', () => {
        // The code you place here will be executed every time your command is executed
       var PORT = 33333;
        var HOST = '127.0.0.1';

        var dgram = require('dgram');
        var server = dgram.createSocket('udp4');

        server.on('listening', function () {
            var address = server.address();
            console.log('UDP Server listening on ' + address.address + ":" + address.port);
        });

        server.on('message', function (message, remote) {
            console.log(remote.address + ':' + remote.port +' - ' + message);

        });

        server.bind(PORT, HOST);
        // Display a message box to the user
        vscode.window.showInformationMessage('Sending to Client!');
    });
    let disposableReceive = vscode.commands.registerCommand('extension.receive', () => {
        // The code you place here will be executed every time your command is executed
        var PORT = 33333;
        var HOST = '127.0.0.1';

        var dgram = require('dgram');
        var message = new Buffer('My KungFu is Good!');

        var client = dgram.createSocket('udp4');
        client.send(message, 0, message.length, PORT, HOST, function(err, bytes) {
            if (err) throw err;
            console.log('UDP message sent to ' + HOST +':'+ PORT);
            client.close();
        });
        // Display a message box to the user
        vscode.window.showInformationMessage('Receiving from Server');
    });
    let disposableGet = vscode.commands.registerCommand('extension.get', () => {
        // The code you place here will be executed every time your command is executed
       
        // Display a message box to the user
        vscode.window.showInformationMessage('Get Text');
        let em: editManager = new editManager();
        console.log(em.getText());
        
    });
    let disposableSet = vscode.commands.registerCommand('extension.set', () => {
        // The code you place here will be executed every time your command is executed
       
        // Display a message box to the user
        vscode.window.showInformationMessage('Set Text');
        let em: editManager = new editManager();
        em.setText("Om");
    });
    context.subscriptions.push(disposable);
    context.subscriptions.push(disposableSend);
    context.subscriptions.push(disposableReceive);
    context.subscriptions.push(disposableGet);
    context.subscriptions.push(disposableSet);
}

// this method is called when your extension is deactivated
export function deactivate() {
}