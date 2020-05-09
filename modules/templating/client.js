const { Node } = require('../html/html');
const formatters = require('./formatters');
const { flat } = require('../array/array');
const { templateComponents, templateParser } = require('./index');
const { parseStatements } = require('../thread/thread-utils');
const { ROUTES_PATH } = require('../../constants');
const { objectToString } = require('../string/string');
const componentsJS = parseStatements(require.context('../../client/components/', true, /.js/));

const replaceNavigation = (locale, htmlTemplate) => {
    const dataNavRegExp = /data-route="([^"]+)"/;
    let match = htmlTemplate.match(dataNavRegExp);
    while (match) {
        const [, attribute] = match;
        const subPath = attribute.endsWith('/') ? `${attribute}index` : attribute;
        const route = `${ROUTES_PATH}${subPath}`;
        const { href } = locale.get(route) || {};
        const custom = { route };
        const attr = `href="${href}" onclick="event.preventDefault();event.custom=${objectToString(custom)};"`;
        htmlTemplate = htmlTemplate.replace(dataNavRegExp, attr);
        match = htmlTemplate.match(dataNavRegExp);
    }
    return htmlTemplate;
};
const extendMixin = (mixin, context) => (element, root) => {
    const destroy = mixin(element, context);
    const attributeName = 'data-expose-as';
    if (!element.getAttribute(attributeName)) return destroy;
    Object.assign(root, { [element.getAttribute(attributeName)]: element });
    return destroy;
};

function createHtmlMarkup({ markup = '', locale }) {
    const componentsMarkup = templateComponents(markup, componentsJS, formatters);
    const parsedMarkup = templateParser
        .partial(componentsMarkup, locale.all(), formatters)
        .compose(replaceNavigation.partial(locale))
        .subscribe();
    return parsedMarkup;
}

const createHtmlElement = ({ markup = '' }, context) => {
    const { locale } = context;
    const element = Node(createHtmlMarkup({ markup, locale }));

    const array = flat(Object.values(componentsJS).map(bundle => {
        const { selector, mixin } = bundle;
        const mixer = extendMixin(mixin, context);
        const selectors = [];
        if (element.matches(selector)) selectors.push(element);
        selectors.push(...Array.prototype.slice.call(element.querySelectorAll(selector)));
        return selectors.map(function (child) {
            return mixer(child, element);
        });
    }));
    const destroy = () => array.forEach(cb => cb());
    return { element, destroy };
};
const createBreadcrumb = (href, route, locale) => {
    const breadcrumb = href.split('/').filter(i => i);
    breadcrumb.shift();
    const routes = route.split('/').map((route, index, array) => {
        return array.slice(0).splice(1, index).join('/');
    });
    routes.shift();
    const string = breadcrumb.map((item, index) => {
        return createHtmlMarkup({
            markup: `<a data-route="${routes[index]}/">${item}</a>`,
            locale
        });
    }).join(' > ');
    return string ? `> ${string}` : '';
};

const getRouteFromHref = (locale, pathname = location.pathname) => {
    const route = locale.route(pathname);
    if (pathname === '/') return 'routes/index';
    if (!route) return 'routes/error/404';
    return route;
};

const createHeadInfoMarkup = (locale, pathname = location.pathname) => {
    const { title } = getRouteFromHref(locale, pathname);
    const markup = `
        <link href="{{assetsManifest.init.logo}}" rel="icon">
        <title>${title}</title>
    `;
    return createHtmlMarkup({ markup, locale });
};

module.exports = {
    createHtmlElement,
    createBreadcrumb,
    createHtmlMarkup,
    createHeadInfoMarkup,
    getRouteFromHref
};
