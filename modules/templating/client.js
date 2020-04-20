const { Node } = require('../html/html');
const formatters = require('./formatters');
const { templateComponents, templateParser } = require('./index');
const { parseStatements } = require('../thread/thread-utils');
const { ROUTES_PATH } = require('../../constants');
const { objectToString } = require('../string/string');

const htmlPages = parseStatements(require.context('../../routes/', true, /.html/));
const styles = parseStatements(require.context('../../routes/', true, /.css/));
const componentsJS = parseStatements(require.context('../../client/components/', true, /.js/));

const replaceNavigation = (locale, htmlTemplate) => {
    const dataNavRegExp = /data-route="([^"]+)"/;
    let match = htmlTemplate.match(dataNavRegExp);
    while (match) {
        const [, attribute] = match;
        const route = `${ROUTES_PATH}${attribute}`;
        const { href } = locale.get(route) || {};
        const custom = { route };
        const attr = `href="${href}" onclick="event.preventDefault();event.custom=${objectToString(custom)};"`;
        htmlTemplate = htmlTemplate.replace(dataNavRegExp, attr);
        match = htmlTemplate.match(dataNavRegExp);
    }
    return htmlTemplate;
};
const extendMixin = mixin => (element, root) => {
    const extended = mixin(element);
    const attributeName = 'data-expose-as';
    if (!element.getAttribute(attributeName)) return;
    Object.assign(root, { [element.getAttribute(attributeName)]: extended });
};

function createHtmlMarkup({ markup = '', locale }) {
    const componentsMarkup = templateComponents(markup, componentsJS, formatters);
    const parsedMarkup = templateParser
        .partial(componentsMarkup, locale.all(), formatters)
        .compose(replaceNavigation.partial(locale))
        .subscribe();
    return parsedMarkup;
}

const createHtmlElement = ({ markup = '', locale }) => {
    const element = Node(createHtmlMarkup({ markup, locale }));

    Object.values(componentsJS).forEach(bundle => {
        const { selector, mixin } = bundle;
        const mixer = extendMixin(mixin);
        if (element.matches(selector)) mixer(element, element);
        element.querySelectorAll(selector).forEach(function (child) {
            mixer(child, element);
        });
    });

    return element;
};
const getRouteTemplate = route => {
    const reduced = route.replace(ROUTES_PATH, '');
    return htmlPages[`${reduced}.html`].replace('>', ` class="${styles[`${reduced}.css`].local}">`);
};
const createRouteFrame = ({ route, locale }) => {
    const page = createHtmlElement({ markup: getRouteTemplate(route), locale });
    const frame = createHtmlElement({ markup: '<i-frame></i-frame>', locale });
    frame.iSetContent(page);
    frame.iSetValue(locale.get(`${route}/title`));
    return frame;
};
const createBreadcrumb = (href, route, locale) => {
    const breadcrumb = href.split('/').filter(i => i);
    const routes = route.split('/').map((route, index, array) => {
        return array.slice(0).splice(1, index).join('/');
    });
    routes[0] = 'index';
    return breadcrumb.map((item, index) => {
        return createHtmlMarkup({
            markup: `<a data-route="${routes[index]}">${item}</a>`,
            locale
        });
    }).join(' > ');
};

module.exports = {
    createRouteFrame,
    createHtmlElement,
    getRouteTemplate,
    createBreadcrumb,
    createHtmlMarkup
};
