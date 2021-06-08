const defaultHeaders = { 'Content-Type': 'application/json' };

const sendRequest = (type, url, body = '', headers) => new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    const headersToSent = { ...defaultHeaders, ...headers };
    request.onreadystatechange = function () {
        if (this.readyState === 4 && this.status.toString().startsWith('2') ) {
            resolve(JSON.parse(request.responseText));
        } else if (this.readyState === 4) {
            reject(JSON.parse(request.responseText));
        }
    };
    request.open(type, url, true);
    Object.keys(headersToSent).forEach(key => {
        request.setRequestHeader(key, headersToSent[key]);
    });
    return request.send(JSON.stringify(body));
});

module.exports = { sendRequest };
