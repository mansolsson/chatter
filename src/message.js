'use strict';

function Message(sender, type, data, timestamp) {
    this.sender = sender;
    this.type = type;
    this.data = data;
    this.timestamp = timestamp;
}

Message.TEXT = 'text';
Message.UPDATE_NAME = 'updatename';

exports.message = Message;
