#!/usr/bin/nodejs
'use strict';

var WebSocketServer = require('websocket').server;
var http = require('http');
var fs = require('fs');

// TODO: Remove client when connection is terminated...
var clients = [];
// TODO: Put port in a config file...
var port = 8080;

// TODO: read files from a configurable folder instead...
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
 
function originIsAllowed(origin) {
  return true;
}
 
wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }

    var connection = request.accept('chatter-protocol', request.origin);
    clients.push(connection);
    console.log((new Date()) + ' Connection accepted.');
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
            for(var i = 0, length = clients.length; i < length; i++) {
                clients[i].sendUTF(message.utf8Data);
            }
        }
    });
});
