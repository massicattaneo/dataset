import { parseStatements } from '../core/core-utils';

const defaultHeaders = { 'Content-Type': 'application/json' };
const htmlPages = parseStatements(require.context('./statements/routes/', true, /.html/));
const styles = parseStatements(require.context('./statements/routes/', true, /.css/));

export const fetchGet = (url, headers) => {
    return fetch(url, { headers: { ...defaultHeaders, headers } })
        .then(response => response.json());
};

export const getRouteTemplate = path => {
    return htmlPages[`${path}.html`].replace('>', ` class="${styles[`${path}.css`].local}">`);
};

