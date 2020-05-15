const WebSocket = require('ws');
const crypto = require('crypto');
const { createUUID } = require('../../../modules/string/string');
const { WS } = require('../../../constants');
const { secret } = require('../../../private.json');
const webSocketServer = new WebSocket.Server({ noServer: true });
const connections = [];
const message = (type, data = {}) => JSON.stringify({
    type,
    data
});
module.exports = async function () {
    const { server, db } = this;
    webSocketServer.on('connection', (wsSocket, request) => {
        const id = createUUID(connections.map(item => item.id));
        const hash = crypto.createHmac('md5', secret)
            .update(id)
            .digest('hex');
        connections.push({ wsSocket, id, hash });
        console.warn(request.headers.origin); // header origin is secure for users that comes from website
        wsSocket.send(message(WS.MESSAGES.CONNECTED, { hash }));
        wsSocket.on('message', function message(msg) {
            console.log(`Received message ${msg}`);
        });
    });

    server.onUpgrade((request, socket, head) => {
        webSocketServer.handleUpgrade(request, socket, head, ws => {
            webSocketServer.emit('connection', ws, request);
        });
    });

};
