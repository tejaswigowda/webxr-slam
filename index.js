#!/usr/bin/env node

var port = parseInt(process.argv[2] || 8888);

var qrcode = require('qrcode-terminal');
const chalk = require('chalk')

function getIPAddress() {
    var interfaces = require('os').networkInterfaces();
    for (var devName in interfaces) {
        var iface = interfaces[devName];

        for (var i = 0; i < iface.length; i++) {
            var alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal)
                return alias.address;
        }
    }
    return '0.0.0.0';
}

var ipAddr = getIPAddress();

const express = require('express');
const app = express();
const server = require('http').Server(app);
const url = require('url');

const WebSocket = require('ws');

const wss1 = new WebSocket.Server({ noServer: true });
const wss2 = new WebSocket.Server({ noServer: true });

const intWS = new WebSocket('ws://localhost:' + port + '/xr-slam-server');
    

// camera websocket
wss1.on('connection', function connection(ws) {
    ws.on('message', function incoming(message, isBinary = false) {
        //console.log('%s', message);
        wss2.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message, { binary: isBinary });
            }
        });
    });
});

// webbrowser websocket
wss2.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        // nothing here should be received
        console.log('received wss2: %s', message);
    });
});

server.on('upgrade', function upgrade(request, socket, head) {
    const pathname = url.parse(request.url).pathname;

    if (pathname === '/xr-slam-server') {
        wss1.handleUpgrade(request, socket, head, function done(ws) {
            wss1.emit('connection', ws, request);
        });
    } else if (pathname === '/xr-slam-client') {
        wss2.handleUpgrade(request, socket, head, function done(ws) {
            wss2.emit('connection', ws, request);
        });
    } else {
        socket.destroy();
    }
});

app.get("/", function (req, res) {
    res.sendFile(__dirname + '/docs/index.html');
});

app.get("/test", function (req, res) {
    res.sendFile(__dirname + '/docs/test.html');
});


app.get("/numberofclients", function (req, res) {
    var numberofclient = wss2.clients.size;
    res.writeHead(200, { 'Content-Type': 'text/plain' }); // send response header
    res.end(numberofclient.toString()); // send response body
});

app.get("/data", function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' }); // send response header
    console.log(req.query);
    console.log(chalk.black.bgGreen(`Test Page:\n http://${ipAddr}:${port}/test/`));
    console.log(chalk.white(`WebSocket Client: ws://${ipAddr}:${port}/xr-slam-client\n`));
    res.end(''); // send response body
    if(intWS.readyState === WebSocket.OPEN) {
        intWS.send(JSON.stringify(req.query));
    }
    else {
        intWS = new WebSocket('ws://localhost:' + port + '/xr-slam-server');
        intWS.send(JSON.stringify(req.query));
    }

});

app.get("/sendData", function (req, res) {
    res.end('ok'); // send response body
});


app.use(express.static(__dirname + '/docs'));

var x = `http://${ipAddr}:${port}/test`;

server.listen(port, () => {
    qrcode.generate(`http://${ipAddr}:${port}`, { small: true }, function (qrcode) {
        console.log(qrcode);
        console.log(chalk.black.bgGreen(`Connect mobile browser at:`));
        console.log(chalk.white(`http://${ipAddr}:${port}/\n`));
    });
});

