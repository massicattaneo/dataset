import { getElementValue } from '../../../modules/html/html';
import { capitalize } from '../../../modules/string/string';
import { xmlToJson } from '../../../modules/xml/xml';

const formElementFormats = {
    capitalize,
    lowerCase: string => string.toLowerCase(),
    upperCase: string => string.toUpperCase(),
    base64: string => btoa(string)
};

export default async function (formElement) {
    return Object.keys(formElement).reduce((obj, key) => {
        const element = formElement[key];
        const name = element.getAttribute('name');
        const type = element.getAttribute('type');
        if (type === 'hidden') return obj;
        if (!name) return obj;
        const string = element.getAttribute('data-formatters') || '';
        const json = xmlToJson(`<xml>${string}</xml>`);
        const formatters = json.children
            .filter(item => formElementFormats[item.content])
            .map(item => formElementFormats[item.content]);
        return {
            ...obj,
            [name]: formatters.reduce((string, formatter) => formatter(string), getElementValue(element))
        };
    }, {});
};
