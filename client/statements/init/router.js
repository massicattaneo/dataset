import { parseStatements } from '../../../core/core-utils';

const htmlPages = parseStatements(require.context('../../../pages/', true, /.html/));
parseStatements(require.context('../../../pages/', true, /.css/));
import { Node } from '../../../modules/html/html';

const components = parseStatements(require.context('../../components/', true, /.js/));

const createPage = path => {
    const home = Node(htmlPages[path]);
    Object.keys(components).forEach(key => {
        const { selector, mixin } = components[key];
        home.querySelectorAll(selector).forEach(element => {
            if (element.getAttribute('data-expose-as')) {
                Object.assign(home, { [element.getAttribute('data-expose-as')]: mixin(element) });
            }
        });
    });
    return home;
}

export default async function () {
    const router = {};
    const appElement = document.getElementById('app');
    const home = createPage('index.html');

    appElement.appendChild(home);
    // window.history.replaceState({}, '', `/${this.store.language.get()}/`);
    return { router, home };
}
