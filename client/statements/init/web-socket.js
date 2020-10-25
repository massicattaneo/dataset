import { SERVER, WS } from '../../../constants';

const RETRY_TIMEOUT = 5000;
const HEARTBEAT_INTERVAL = 10000;

let ws = { close: e => e };
let promise;
let retryTimeout;
let heartbeatInterval;
let signature;

const send = (type, data = {}) => ws.send(JSON.stringify({ type, data }));
const receive = (type, data) => {
    console.warn(type, data);
};

const start = () => {
    ws.close();
    clearTimeout(retryTimeout);
    clearInterval(heartbeatInterval);
    promise = new Promise((resolve, reject) => {
        ws = new WebSocket(SERVER.WSS_ORIGIN);
        ws.onclose = () => {
            reject();
            retryTimeout = setTimeout(start, RETRY_TIMEOUT);
        };
        ws.onmessage = message => {
            const { data, type } = JSON.parse(message.data);
            if (type === WS.MESSAGES.CONNECTED) {
                clearTimeout(retryTimeout);
                if (!signature) signature = data.signature;
                heartbeatInterval = setInterval(() => {
                    send(WS.MESSAGES.HEARTBEAT, { signature });
                }, HEARTBEAT_INTERVAL);
                send(WS.MESSAGES.HEARTBEAT, data);
                resolve({ signature });
            } else {
                receive(type, data);
            }
        };
    });
};

export default async function () {
    start();

    const webSocket = {
        getSignature: async () => (await promise).signature
    };

    return { webSocket };
}
