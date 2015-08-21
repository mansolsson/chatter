'use strict';

window.onload = function() {
    var ws = new WebSocket('ws://localhost:8080', 'chatter-protocol');
    ws.onmessage = function(event) {
        document.getElementById('message-box').innerHTML += '<p>' + event.data + '</p>';
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
