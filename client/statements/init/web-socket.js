import { SERVER, WS } from '../../../constants';

const message = (type, data = {}) => JSON.stringify({ type, data });

export default async function () {
    const webSocketInstance = new WebSocket(SERVER.WSS_ORIGIN);
    webSocketInstance.onclose = function (error) {
        console.log('Socket is closed. Reconnect will be attempted in 1 second.', error.reason);
    };

    webSocketInstance.onerror = function (error) {
        console.log('Socket encountered error: ', error.message, 'Closing socket');
        webSocketInstance.close();
    };

    webSocketInstance.onopen = function (...args) {
        setInterval(function () {
            webSocketInstance.send(message(WS.MESSAGES.HEARTBEAT));
        }, 3000);
        console.warn('PEPE', ...args);
    };

    const idPromise = new Promise(resolve => {
        webSocketInstance.onmessage = function (message) {
            const { data, type } = JSON.parse(message.data);
            if (type === WS.MESSAGES.CONNECTED) resolve(data);
            console.warn('message', type, data);
        };
    });

    const webSocket = {
        getId: () => idPromise
    };

    return { webSocket };
}
