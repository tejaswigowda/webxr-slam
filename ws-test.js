var port = process.argv[2] || 8888;

var WebSocket = require('ws');

var ws = new WebSocket('ws://localhost:' + port + '/xr-slam-client');

ws.on('open', function open() {
    console.log('connected to ws://localhost:' + port + '/xr-slam-client');
});

ws.on('close', function close() {
    console.log('disconnected');
});

ws.on('message', function incoming(data) {
    console.log('received: %s', data);
});
