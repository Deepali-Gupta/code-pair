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
    var rinfo : any;
    var server : any;
    var client : any;
    let em :editManager= new editManager();
    var PORT = 33333;
    var HOST = '127.0.0.1';

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.sayHello', () => {
        // The code you place here will be executed every time your command is executed
       
        // Display a message box to the user
        vscode.window.showInformationMessage('Hello World!');
       
    });
    let disposableServer = vscode.commands.registerCommand('extension.server', () => {
        // The code you place here will be executed every time your command is executed
       var PORT = 33333;
       var HOST = '127.0.0.1';

        var dgram = require('dgram');
        server = dgram.createSocket('udp4');

        server.on('listening', function () {
            var address = server.address();
            console.log('UDP Server listening on ' + address.address + ":" + address.port);
        });

        server.on('message', function (message: string, remote) {
            console.log(remote.address + ':' + remote.port +' - ' + message);
            rinfo = remote;
            console.log(rinfo.port+' '+rinfo.address);
            em.setText(message+"");
        });
         server.bind(PORT, HOST); 
        
        
        // Display a message box to the user
        vscode.window.showInformationMessage('Server on!');
    });
    let disposableServerSend = vscode.commands.registerCommand('extension.serversend', () => {
        // The code you place here will be executed every time your command is executed
       let ack:string=em.getText();
       console.log(rinfo.port);
        server.send(ack, 0, ack.length, rinfo.port, rinfo.address, function(err, bytes) {
            if (err) throw err;
            console.log('UDP message sent to ' + rinfo.address +':'+ rinfo.port);
            //client.close();
        });  
       
        // Display a message box to the user
        vscode.window.showInformationMessage('Sending from server!');
       
    });
    let disposableClient = vscode.commands.registerCommand('extension.client', () => {
        // The code you place here will be executed every time your command is executed
        
        var dgram = require('dgram');
        
        client = dgram.createSocket('udp4');
        
        client.on('message', function (message: string, remote) {
            console.log(remote.address + ':' + remote.port +' - ' + message);
            rinfo = remote;
            let em: editManager = new editManager();
            em.setText(message+"");
        });
      
        // Display a message box to the user
        vscode.window.showInformationMessage('Client On!');
    });
    let disposableClientSend = vscode.commands.registerCommand('extension.clientsend', () => {
        // The code you place here will be executed every time your command is executed
        var message = em.getText();
        client.send(message, 0, message.length, PORT, HOST, function(err, bytes) {
            if (err) throw err;
            console.log('UDP message sent to ' + HOST +':'+ PORT);
            //client.close();
        });
        // Display a message box to the user
        vscode.window.showInformationMessage('Send from Client');
       
    });
    context.subscriptions.push(disposable);
    context.subscriptions.push(disposableServer);
    context.subscriptions.push(disposableClient);
    context.subscriptions.push(disposableServerSend);
    context.subscriptions.push(disposableClientSend);
}

// this method is called when your extension is deactivated
export function deactivate() {
}