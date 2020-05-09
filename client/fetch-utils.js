const defaultHeaders = { 'Content-Type': 'application/json' };

const sendRequest = (type, url, body = '', headers) => new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    const headersToSent = { ...defaultHeaders, ...headers };
    request.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            resolve(JSON.parse(request.responseText));
        } else if (this.readyState === 4) {
            reject();
        }
    };
    request.open(type, url, true);
    Object.keys(headersToSent).forEach(key => {
        request.setRequestHeader(key, headersToSent[key]);
    });
    request.send(JSON.stringify(body));
});

export const fetchGetJSON = (url, headers) => sendRequest('GET', url, '', headers);

export const fetchPostJSON = (url, body, headers) => sendRequest('POST', url, body, headers);

