const WebSocket = require('ws');
const { createSignature } = require('../../crypto-utils');
const { createUUID } = require('../../../modules/string/string');
const { WS, SERVER } = require('../../../constants');
const connections = [];
const ALIVE_INTERVAL = 30000;

const message = (type, data = {}) => JSON.stringify({
    type,
    data
});

module.exports = async function () {
    const webSocketServer = new WebSocket.Server({ noServer: true });
    const { server, db } = this;

    setInterval(() => {
        webSocketServer.clients.forEach(ws => {
            if (ws.isAlive === false) return ws.terminate();
            ws.isAlive = false;
        });
    }, ALIVE_INTERVAL);

    webSocketServer.on('connection', (wsSocket, request) => {
        const id = createUUID(connections.map(item => item.id));
        const signature = createSignature(id);
        connections.push({ wsSocket, id, signature });
        wsSocket.isAlive = true;
        wsSocket.send(message(WS.MESSAGES.CONNECTED, { signature }));
        wsSocket.on('message', message => {
            const { type, data } = JSON.parse(message);
            if (type === WS.MESSAGES.HEARTBEAT) wsSocket.isAlive = true;
        });
    });

    server.onUpgrade((request, socket, head) => {
        if (SERVER.HTTPS_ORIGIN !== request.headers.origin) {
            socket.destroy();
        } else {
            webSocketServer.handleUpgrade(request, socket, head, ws => {
                webSocketServer.emit('connection', ws, request);
            });
        }
    });
};
