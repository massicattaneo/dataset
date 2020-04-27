import { SERVER } from '../../../constants';
import { wait } from '../../../modules/wait/wait';

export default async function () {
    const webSocket = {};
    const webSocketInstance = new WebSocket(SERVER.WSS_ORIGIN);

    webSocketInstance.onmessage = function (message) {
    };

    webSocketInstance.onclose = function (error) {
        console.log('Socket is closed. Reconnect will be attempted in 1 second.', error.reason);
    };

    webSocketInstance.onerror = function (error) {
        console.log('Socket encountered error: ', error.message, 'Closing socket');
        webSocketInstance.close();
    };

    const openPromise = new Promise(resolve => {
        webSocketInstance.onopen = function () {
            // setInterval(function () {
            //     webSocket.send(JSON.stringify({ type: 'heartbeat' }));
            // }, 3000);
            resolve();
            webSocketInstance.send(JSON.stringify({ type: 'open' }));
        };
    });

    await Promise.race([openPromise, wait.time(1000)]);

    return { webSocket }
}
