const defaultHeaders = { 'Content-Type': 'application/json' };

export const fetchGet = (url, headers) => {
    return fetch(url, { headers: { ...defaultHeaders, headers } })
        .then(response => response.json());
};
