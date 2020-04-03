import { parseStatements } from '../../../core/core-utils';
import { addCssClass, Node } from '../../../modules/html/html';
import { templateParser, templateComponents } from '../../../modules/templating';

const htmlPages = parseStatements(require.context('../../../pages/', true, /.html/));
parseStatements(require.context('../../../pages/', true, /.css/));

const componentsJS = parseStatements(require.context('../../components/', true, /.js/));

const createHtmlPage = (markup, locales) => {
    const componentsMarkup = templateComponents(markup, componentsJS);
    const home = Node(templateParser(componentsMarkup, locales));
    Object.values(componentsJS).forEach(bundle => {
        const { selector, mixin } = bundle;
        home.querySelectorAll(selector).forEach(element => {
            const extended = mixin(element);
            if (element.getAttribute('data-expose-as')) {
                Object.assign(home, { [element.getAttribute('data-expose-as')]: extended });
            }
        });
    });
    return home;
};

export default async function () {
    const { locale, store } = this;
    const router = {};
    const appElement = document.getElementById('app');
    const home = createHtmlPage(htmlPages['index.html'], locale.all());
    addCssClass(document.body, store.device.type.get());

    appElement.appendChild(home);
    // window.history.replaceState({}, '', `/${this.store.language.get()}/`);
    return { router, home };
}
