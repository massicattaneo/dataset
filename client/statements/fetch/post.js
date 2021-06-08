import { sendRequest } from '../../fetch-utils';

export default async function (url, body, headers = {}) {
    const signature = await this.sharedContext.webSocket.getSignature();
    return sendRequest('POST', url, body, { signature, ...headers });
}
