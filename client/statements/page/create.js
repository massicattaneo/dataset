import { templateComponents, templateParser } from '../../../modules/templating';
import { Node } from '../../../modules/html/html';
import { parseStatements } from '../../../core/core-utils';

const componentsJS = parseStatements(require.context('../../components/', true, /.js/));

const formatters = {
    default: function (value, param) {
        return value || param;
    },
    pepe: function () {
        return 1;
    }
};

export default async function ({ markup }) {
    const { locale } = this;
    const locales = locale.all();
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
}
