import { sendRequest } from '../../fetch-utils';

export default async function (url, headers = {}) {
    const signature = await this.sharedContext.webSocket.getSignature();
    return sendRequest('GET', url, '', { signature, ...headers });
}
