'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import editManager from './editManager'
// import masterController from './masterController'
import {SessionVariables} from './Constants'
 var rinfo : any;
    var server : any;
    var client : any;
    let em :editManager= new editManager();
    var PORT = 33333;
    var HOST = '127.0.0.1';
    var arr = [];
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "codepair" is now active!');
   
    let _editManager = new editManager();
    let _masterController = new masterController(_editManager);
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
      //      console.log('UDP Server listening on ' + address.address + ":" + address.port);
        });

        server.on('message', function (message: string, remote) {
         //   console.log(remote.address + ':' + remote.port +' - ' + message);
            rinfo = remote;
           // console.log(rinfo.port+' '+rinfo.address);
            em.setText(message+"");
        });
         server.bind(PORT, HOST); 
         SessionVariables.I_AM_SERVER = true;
        
        
        // Display a message box to the user
        vscode.window.showInformationMessage('Server on!');
    });
    let disposableServerSend = vscode.commands.registerCommand('extension.serversend', () => {
        // The code you place here will be executed every time your command is executed
       let ack:string=em.getText();
       //console.log(rinfo.port);
        server.send(ack, 0, ack.length, rinfo.port, rinfo.address, function(err, bytes) {
            if (err) throw err;
        //    console.log('UDP message sent to ' + rinfo.address +':'+ rinfo.port);
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
            var pos = message.indexOf('|');
            var num = message.slice(0,pos);
            console.log(num);
            arr = arr.concat(num);
            console.log(arr);
            em.setText(message.slice(pos+1,message.length)+"");
        });
      
        // Display a message box to the user
        vscode.window.showInformationMessage('Client On!');
    });
    let disposableClientSend = vscode.commands.registerCommand('extension.clientsend', () => {
        // The code you place here will be executed every time your command is executed
        var message = em.getText();
        client.send(message, 0, message.length, PORT, HOST, function(err, bytes) {
            if (err) throw err;
          //  console.log('UDP message sent to ' + HOST +':'+ PORT);
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
class masterController {

    private _editManager: editManager;
    private _disposable: vscode.Disposable;

    constructor(editManager: editManager) {
        this._editManager = editManager;
        // this._wordCounter.updateWordCount();

        // subscribe to selection change and editor activation events
        let subscriptions: vscode.Disposable[] = [];
        vscode.window.onDidChangeTextEditorSelection(this._onEvent, this, subscriptions);
        // vscode.window.onDidChangeActiveTextEditor(this._onEvent, this, subscriptions);

        // update the counter for the current file
        // this._editManager.updateWordCount();

        // create a combined disposable from both event subscriptions
        this._disposable = vscode.Disposable.from(...subscriptions);
    }

    dispose() {
        this._disposable.dispose();
    }

    private _onEvent() {
        //console.log("Key Presses");
        //Remember to set it true during initailization
        if(SessionVariables.I_AM_SERVER){
            //TODO
            var pos = vscode.window.activeTextEditor.selection.active.line;
             let ack:string=pos+'|'+em.getText();
             
      // console.log(rinfo.port);
        server.send(ack, 0, ack.length, rinfo.port, rinfo.address, function(err, bytes) {
            if (err) throw err;
        //    console.log('UDP message sent to ' + rinfo.address +':'+ rinfo.port);
            //client.close();
        });  
       
        // Display a message box to the user
        vscode.window.showInformationMessage('Sending from server!');

        }
        else{
            //TODO
            var message = em.getText();
        client.send(message, 0, message.length, PORT, HOST, function(err, bytes) {
            if (err) throw err;
          //  console.log('UDP message sent to ' + HOST +':'+ PORT);
            //client.close();
        });
        // Display a message box to the user
        vscode.window.showInformationMessage('Send from Client');
            
        }
    }
}