import { getElementValue } from '../../../modules/html/html';
import { xmlToJson } from '../../../modules/xml/xml';
import { formatter } from '../../../modules/formatter/formatter';

export default async function (formElement) {
    return Object.keys(formElement).reduce((obj, key) => {
        const element = formElement[key];
        const name = element.getAttribute('name');
        const type = element.getAttribute('type');
        if (type === 'hidden') return obj;
        if (!name) return obj;
        const string = element.getAttribute('data-formatters') || '';
        const { children: formatters = [] } = xmlToJson(`<xml>${string}</xml>`) || {};
        return {
            ...obj,
            [name]: formatters.reduce((string, item) => formatter(item, string), getElementValue(element))
        };
    }, {});
};
