'use strict';

window.onload = function() {
    var name = prompt('Enter name');

    var ws = new WebSocket('ws://' + location.host, 'chatter-protocol');
    ws.onmessage = function(event) {
        var message = JSON.parse(event.data);

        var messageMetaDiv = document.createElement('div');
        messageMetaDiv.className = 'message-meta';
        messageMetaDiv.appendChild(document.createTextNode(message.sender));
        messageMetaDiv.appendChild(document.createElement('br'));
        messageMetaDiv.appendChild(document.createTextNode(message.timestamp));

        var messageDiv = document.createElement('div');
        messageDiv.className = 'message';
        messageDiv.appendChild(document.createTextNode(message.data));
        messageDiv.appendChild(document.createElement('br'));
        messageDiv.appendChild(messageMetaDiv);

        document.getElementById('message-box').appendChild(messageDiv);
    };
    ws.onopen = function() {
        ws.send(JSON.stringify({
            type: 'updatename',
            name: name
        }));

        document.getElementById('ib').onclick = function(event) {
            var message = {
                type: 'text',
                text: document.getElementById('im').value
            };
            ws.send(JSON.stringify(message));
            document.getElementById('im').value = '';
        };
        document.getElementById('im').onkeypress = function(event) {
            if(event.keyCode === 13) {
                var message = {
                    type: 'text',
                    text: document.getElementById('im').value
                };
                ws.send(JSON.stringify(message));
                document.getElementById('im').value = '';
            }
        };
    };
    document.getElementById('im').focus();
};