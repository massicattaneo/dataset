import { parseStatements } from '../../../core/core-utils';
import { addCssClass, Node } from '../../../modules/html/html';
import { templateParser, templateComponents } from '../../../modules/templating';
import { touchType } from '../../../modules/device/device-client';
import { formatters } from '../../../modules/templating/formatters';

const htmlPages = parseStatements(require.context('../../../pages/', true, /.html/));
parseStatements(require.context('../../../pages/', true, /.css/));

const componentsJS = parseStatements(require.context('../../components/', true, /.js/));

const createHtmlPage = (markup, locales) => {
    const componentsMarkup = templateComponents(markup, componentsJS, formatters);
    const parsedMarkup = templateParser(componentsMarkup, locales, formatters);
    const home = Node(parsedMarkup);
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
    const { locale } = this;
    const router = {};
    const appElement = document.getElementById('app');
    const home = createHtmlPage(htmlPages['index.html'], locale.all());
    addCssClass(document.body, touchType);

    appElement.appendChild(home);
    // window.history.replaceState({}, '', `/${this.store.language.get()}/`);
    return { router, home };
}
