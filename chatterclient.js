'use strict';

window.onload = function() {
    var ws = new WebSocket('ws://localhost:8080', 'chatter-protocol');
    ws.onmessage = function(event) {
        var messageMetaDiv = document.createElement('div');
        messageMetaDiv.className = 'message-meta';
        messageMetaDiv.appendChild(document.createTextNode('Test Testsson'));
        messageMetaDiv.appendChild(document.createElement('br'));
        messageMetaDiv.appendChild(document.createTextNode('2014-01-01 11:12'));

        var messageDiv = document.createElement('div');
        messageDiv.className = 'message';
        messageDiv.appendChild(document.createTextNode(event.data));
        messageDiv.appendChild(document.createElement('br'));
        messageDiv.appendChild(messageMetaDiv);

        document.getElementById('message-box').appendChild(messageDiv);
    };
    ws.onopen = function() {
        document.getElementById('ib').onclick = function(event) {
            ws.send(document.getElementById('im').value);
            document.getElementById('im').value = '';
        };
        document.getElementById('im').onkeypress = function(event) {
            if(event.keyCode === 13) {
                ws.send(document.getElementById('im').value);
                document.getElementById('im').value = '';
            }
        };
    };
    document.getElementById('im').focus();
};
