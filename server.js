var WebSocket = require('ws');
var wss = new WebSocket.Server({ port: 8080 });
wss.on('connection', function (ws) {
    ws.on('message', function (message) {
        // console.log("Received message => " + message);
    });
    ws.send('ho!');
});
