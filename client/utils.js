import { parseStatements } from '../modules/thread/thread-utils';
import { ROUTES_PATH } from '../constants';

const htmlPages = parseStatements(require.context('../routes/', true, /.html/));
const styles = parseStatements(require.context('../routes/', true, /.css/));

const defaultHeaders = { 'Content-Type': 'application/json' };

export const fetchGet = (url, headers) => {
    return fetch(url, { headers: { ...defaultHeaders, headers } })
        .then(response => response.json());
};

export const getRouteTemplate = route => {
    const reduced = route.replace(ROUTES_PATH, '');
    return htmlPages[`${reduced}.html`].replace('>', ` class="${styles[`${reduced}.css`].local}">`);
};

