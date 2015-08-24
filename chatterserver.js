#!/usr/bin/nodejs
'use strict';

var WebSocketServer = require('websocket').server;
var http = require('http');
var fs = require('fs');
var Connections = require('./connections').connections;

var connections = new Connections();
var port = 8080;

var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Got request for ' + request.url);
    if(request.url === '/' || request.url === '/index.html') {
        response.end(fs.readFileSync('index.html'));
    }
    else if(request.url === '/chatterclient.js') {
        response.end(fs.readFileSync('chatterclient.js'));
    }
    else if(request.url === '/chatterclient.css') {
        response.end(fs.readFileSync('chatterclient.css'));
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
    connections.add(connection);

    console.log((new Date()) + ' Connection accepted.');
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
            connections.broadCast(message.utf8Data);
        }
    });
    connection.on('close', function(reasonCode, description) {
        connections.remove(connection);
    });
});
