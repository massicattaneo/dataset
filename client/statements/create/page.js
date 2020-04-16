import { templateComponents, templateParser } from '../../../modules/templating';
import { hasCssClass, Node } from '../../../modules/html/html';
import { parseStatements } from '../../../core/core-utils';
import { objectToString } from '../../../modules/string/string';

const htmlPages = parseStatements(require.context('../routes/', true, /.html/));
parseStatements(require.context('../routes/', true, /.scss/));

const componentsJS = parseStatements(require.context('../../components/', true, /.js/));

const formatters = {
    default: function (value, param) {
        return value || param;
    },
    pepe: function () {
        return 1;
    }
};

function replaceNavigation(locale, htmlTemplate) {
    const dataNavRegExp = /data-nav="([^"]+)"/;
    let match = htmlTemplate.match(dataNavRegExp);
    while (match) {
        const [, basicPath] = match;
        const path = `routes/${basicPath}`;
        const href = locale.get({ path });
        const custom = { href, path };
        const attr = `href=${href} onclick="event.preventDefault();event.custom=${objectToString(custom)}"`;
        htmlTemplate = htmlTemplate.replace(dataNavRegExp, attr);
        match = htmlTemplate.match(dataNavRegExp);
    }
    return htmlTemplate;
}

const extendMixin = mixin => element => {
    const extended = mixin(element);
    if (element.getAttribute('data-expose-as')) {
        Object.assign(element, { [element.getAttribute('data-expose-as')]: extended });
    }
};

export default async function ({ path = '', markup = '' }) {
    const { locale } = this;
    const locales = locale.all();
    const htmlMarkup = markup || htmlPages[path];
    const componentsMarkup = templateComponents(htmlMarkup, componentsJS, formatters);
    const parsedMarkup = templateParser
        .partial(componentsMarkup, locales, formatters)
        .compose(replaceNavigation.partial(locale))
        .subscribe();
    const element = Node(parsedMarkup);

    Object.values(componentsJS).forEach(bundle => {
        const { selector, mixin } = bundle;
        const mixer = extendMixin(mixin);
        if (element.matches(selector)) {
            mixer(element);
        }
        element.querySelectorAll(selector).forEach(mixer);
    });

    return element;
}
