#!/usr/bin/nodejs
'use strict';

var WebSocketServer = require('websocket').server;
var http = require('http');
var fs = require('fs');

function User(name, connection) {
    this.name = name;
    this.connection = connection;
}

var activeUsers = [];
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
 
function addUser(name, connection) {
    activeUsers.push(new User(name, connection));
    console.log('New user added, ' + activeUsers.length + ' total');
}

function removeUser(connection) {
    for(var i = 0; i < activeUsers.length; i++) {
        if(activeUsers[i].connection === connection) {
            activeUsers.splice(i, 1);
            break;
        }
    }
    console.log('Removed user, ' + activeUsers.length + ' total');
}

function sendMessageToUsers(message) {
    for(var i = 0; i < activeUsers.length; i++) {
        activeUsers[i].connection.sendUTF(message);
    }
}

wsServer.on('request', function(request) {
    var connection = request.accept('chatter-protocol', request.origin);
    addUser('Unknown', connection);

    console.log((new Date()) + ' Connection accepted.');
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
            sendMessageToUsers(message.utf8Data);
        }
    });
    connection.on('close', function(reasonCode, description) {
        removeUser(connection);
    });
});
