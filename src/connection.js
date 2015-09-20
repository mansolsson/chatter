'use strict';

function Connection(connection, name) {
    this.connection = connection;
    this.name = name || 'unknown';
}

Connection.prototype.sendMessage = function(message) {
    this.connection.sendUTF(JSON.stringify(message));
};

exports.connection = Connection;
