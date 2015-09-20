#!/usr/bin/nodejs
'use strict';

var WebSocketServer = require('websocket').server;
var http = require('http');
var fs = require('fs');
var Connections = require('./connections').connections;
var Message = require('./message').message;

var connections = new Connections();
var port = 8080;
var clientFolder = 'client/'

var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Got request for ' + request.url);
    if(request.url === '/' || request.url === '/index.html') {
        response.end(fs.readFileSync(clientFolder + 'index.html'));
    }
    else if(request.url === '/chatterclient.js') {
        response.end(fs.readFileSync(clientFolder + 'chatterclient.js'));
    }
    else if(request.url === '/chatterclient.css') {
        response.end(fs.readFileSync(clientFolder + 'chatterclient.css'));
    }
    else {
        response.writeHead(404);
        response.end();
    }
});
server.listen(port, function() {
    console.log('Server is listening on port ' + port);
});
 
var wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});

wsServer.on('request', function(request) {
    var connection = request.accept('chatter-protocol', request.origin);
    connections.addConnection(connection);

    console.log((new Date()) + ' Connection accepted.');
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
            var cmessage = JSON.parse(message.utf8Data);
            if(cmessage.type === Message.TEXT) {
                var message = new Message(connections.getNameOfConnection(this), Message.TEXT, cmessage.text, new Date());
                connections.broadCast(message);
            } else if(cmessage.type === Message.UPDATE_NAME) {
                connections.updateNameOfConnection(this, cmessage.name);
            }
        }
    });
    connection.on('close', function(reasonCode, description) {
        connections.removeConnection(connection);
    });
});
