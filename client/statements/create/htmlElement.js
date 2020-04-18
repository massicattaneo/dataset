import { templateComponents, templateParser } from '../../../modules/templating';
import { Node } from '../../../modules/html/html';
import { parseStatements } from '../../../modules/thread/thread-utils';
import { objectToString } from '../../../modules/string/string';
import * as formatters from '../../../modules/templating/formatters';
import { ROUTES_PATH } from '../../../constants';

const componentsJS = parseStatements(require.context('../../components/', true, /.js/));

function replaceNavigation(locale, htmlTemplate) {
    const dataNavRegExp = /data-nav="([^"]+)"/;
    let match = htmlTemplate.match(dataNavRegExp);
    while (match) {
        const [, basicPath] = match;
        const path = `${ROUTES_PATH}${basicPath}`;
        const href = locale.href(path);
        const custom = { path };
        const attr = `href=${href} onclick="event.preventDefault();event.custom=${objectToString(custom)}"`;
        htmlTemplate = htmlTemplate.replace(dataNavRegExp, attr);
        match = htmlTemplate.match(dataNavRegExp);
    }
    return htmlTemplate;
}

const extendMixin = mixin => (element, root) => {
    const extended = mixin(element);
    if (element.getAttribute('data-expose-as')) {
        Object.assign(root, { [element.getAttribute('data-expose-as')]: extended });
    }
};

export default async function ({ markup = '' }) {
    const { locale } = this;
    const locales = locale.all();
    const componentsMarkup = templateComponents(markup, componentsJS, formatters);
    const parsedMarkup = templateParser
        .partial(componentsMarkup, locales, formatters)
        .compose(replaceNavigation.partial(locale))
        .subscribe();
    const element = Node(parsedMarkup);

    Object.values(componentsJS).forEach(bundle => {
        const { selector, mixin } = bundle;
        const mixer = extendMixin(mixin);
        if (element.matches(selector)) {
            mixer(element, element);
        }
        element.querySelectorAll(selector).forEach(function (child) {
            mixer(child, element);
        });
    });

    return element;
}
