import { templateComponents, templateParser } from '../../../modules/templating';
import { Node } from '../../../modules/html/html';
import { parseStatements } from '../../../core/core-utils';
import { escapeChar, objectToString } from '../../../modules/string/string';

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
        const [, path] = match;
        const href = locale.get({ path });
        const custom = { href, path };
        const attr = `href=${href} onclick="event.preventDefault();event.custom=${objectToString(custom)}"`;
        htmlTemplate = htmlTemplate.replace(dataNavRegExp, attr);
        match = htmlTemplate.match(dataNavRegExp);
    }
    return htmlTemplate;
}

export default async function ({ markup }) {
    const { locale } = this;
    const locales = locale.all();
    const componentsMarkup = templateComponents(markup, componentsJS, formatters);
    const parsedMarkup = templateParser
        .partial(componentsMarkup, locales, formatters)
        .compose(replaceNavigation.partial(locale))
        .subscribe();
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
}
