import { parseStatements } from '../../../core/core-utils';
import { addCssClass, Node } from '../../../modules/html/html';
import { xmlToSimpleJson } from '../../../modules/xml/xml';
import { templateParser } from '../../../modules/templating';
import { attributesRegEx, tagRegEx } from '../../../modules/regexp/regexp';

const htmlPages = parseStatements(require.context('../../../pages/', true, /.html/));
parseStatements(require.context('../../../pages/', true, /.css/));

const componentsJS = parseStatements(require.context('../../components/', true, /.js/));

const createPage = (markup, locales) => {
    Object.values(componentsJS).forEach(bundle => {
        const { template, tagName } = bundle;
        let start = markup.match(new RegExp(`<${tagName}[^^]*>`)).index;
        while (start) {
            const end = markup.match(new RegExp(`</${tagName}>`)).index + tagName.length + 3;
            const toSubstitute = markup.substr(start, end - start);
            const params = xmlToSimpleJson(toSubstitute);
            const [, firstNode] = toSubstitute.replace(/\n∫/, '').match(tagRegEx);
            const [attributes] = firstNode.match(attributesRegEx) || [''];
            const taggedTemplate = template.replace('>', ` ${attributes}>`);
            markup = markup.replace(toSubstitute, templateParser(taggedTemplate, params));
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
    const { locale, store } = this;
    const router = {};
    const appElement = document.getElementById('app');
    const home = createPage(htmlPages['index.html'], locale.all());
    addCssClass(document.body, store.device.type.get());

    appElement.appendChild(home);
    // window.history.replaceState({}, '', `/${this.store.language.get()}/`);
    return { router, home };
}
