import { parseStatements } from '../../../core/core-utils';
import { Node } from '../../../modules/html/html';
import { xmlToSimpleJson } from '../../../modules/xml/xml';
import { templateParser } from '../../../modules/templating';

const htmlPages = parseStatements(require.context('../../../pages/', true, /.html/));
parseStatements(require.context('../../../pages/', true, /.css/));

const componentsJS = parseStatements(require.context('../../components/', true, /.js/));

const createPage = (path, locales) => {
    let markup = htmlPages[path];

    Object.values(componentsJS).forEach(bundle => {
        const { template, tagName } = bundle;
        let start = markup.match(new RegExp(`<${tagName}[^^]*>`)).index;
        while (start) {
            const end = markup.match(new RegExp(`</${tagName}>`)).index + tagName.length + 3;
            const toSubstitute = markup.substr(start, end - start);
            const params = xmlToSimpleJson(toSubstitute);
            markup = markup.replace(toSubstitute, templateParser(template, params));
            start = (markup.match(new RegExp(`<${tagName}[^^]*>`)) || {}).index;
        }

    });

    const home = Node(templateParser(markup, locales));
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
    const home = createPage('index.html', locale.all());

    appElement.appendChild(home);
    // window.history.replaceState({}, '', `/${this.store.language.get()}/`);
    return { router, home };
}
