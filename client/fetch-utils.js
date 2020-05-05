const defaultHeaders = { 'Content-Type': 'application/json' };

export const fetchGetJSON = (url, headers) => new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    const headersToSent = { ...defaultHeaders, ...headers };
    request.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            resolve(JSON.parse(request.responseText));
        } else if (this.readyState === 4) {
            reject();
        }
    };
    request.open('GET', url, true);
    Object.keys(headersToSent).forEach(key => {
        request.setRequestHeader(key, headersToSent[key]);
    });
    request.send();
});

