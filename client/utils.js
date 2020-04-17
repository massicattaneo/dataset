import { parseStatements } from '../modules/thread/thread-utils';

const htmlPages = parseStatements(require.context('../routes/', true, /.html/));
const styles = parseStatements(require.context('../routes/', true, /.css/));

const defaultHeaders = { 'Content-Type': 'application/json' };

export const fetchGet = (url, headers) => {
    return fetch(url, { headers: { ...defaultHeaders, headers } })
        .then(response => response.json());
};

export const getRouteTemplate = path => {
    return htmlPages[`${path}.html`].replace('>', ` class="${styles[`${path}.css`].local}">`);
};

