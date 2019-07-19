const WebSocket = require('ws');
 
const ws = new WebSocket('ws://10.4.12.108:8080');
 
ws.on('open', function open() {
  ws.send('something');
});
 
ws.on('message', function incoming(data) {
  console.log(data);
});