'use strict';

function Connections() {
    this.connections = [];
}

Connections.prototype.add = function(connection, name) {
    this.connections.push(new Connection(connection, name));
};

Connections.prototype.remove = function(connection) {
    for(var i = 0; i < this.connections.length; i++) {
        if(this.connections[i].connection === connection) {
            this.connections.splice(i, 1);
            break;
        }
    }
};

Connections.prototype.broadCast = function(message) {
    for(var i = 0; i < this.connections.length; i++) {
        this.connections[i].connection.sendUTF(message);
    }
};

function Connection(connection, name) {
    this.connection = connection;
    this.name = name || 'Unknown';
}

exports.connections = Connections;
