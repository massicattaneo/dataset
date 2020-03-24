export const loadHttp = resource => {
    const request = new XMLHttpRequest();
    request.open('GET', resource.url);
    const start = Date.now();

    return new Promise((resolve, reject) => {
        request.onreadystatechange = () => {
            if (request.status === 200 && request.readyState === 4) {
                resolve({
                    stats: { start, end: Date.now(), resource },
                    resource: simpleObjectExtend({ data: request.responseText }, resource)
                });
            } else if (request.status !== 200 && request.readyState === 4) {
                reject({ message: `HTTP REQUEST STATUS ${request.status}`, resource });
            }
        };
        request.send();
    });
};
