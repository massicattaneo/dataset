const WebSocket = require('ws');
const webSocketServer = new WebSocket.Server({ noServer: true });

module.exports = async function () {
    const { server } = this;

    webSocketServer.on('connection', (ws, request) => {
        ws.on('message', function message(msg) {
            console.log(`Received message ${msg}`);
        });
    });

    server.onUpgrade((request, socket, head) => {
        webSocketServer.handleUpgrade(request, socket, head, ws => {
            webSocketServer.emit('connection', ws, request);
        });
    });

};
