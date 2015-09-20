'use strict';

var Connection = require('./connection').connection;

function Connections() {
    this.connections = [];
}

Connections.prototype.addConnection = function(connection) {
    this.connections.push(new Connection(connection));
};

Connections.prototype.removeConnection = function(connection) {
    this.connections = this.connections.filter(function(conn) {
        return conn.connection !== connection;
    });
};

Connections.prototype.broadCast = function(message) {
    this.connections.forEach(function(conn) {
        conn.sendMessage(message);
    });
};

Connections.prototype.getNameOfConnection = function(connection) {
    for(var i = 0, length = this.connections.length; i < length; i++) {
        if(this.connections[i].connection === connection) {
            return this.connections[i].name;
        }
    }
    return 'unknown';
};

Connections.prototype.updateNameOfConnection = function(connection, name) {
    this.connections.filter(function(conn) {
        return conn.connection === connection;
    }).forEach(function(conn) {
        conn.name = name;
    });
};

exports.connections = Connections;
