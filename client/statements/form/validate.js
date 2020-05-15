import { xmlToJson } from '../../../modules/xml/xml';
import { validator } from '../../../modules/validator/validator';

export default async function (formElement, elementNames) {
    const elements = Object.keys(formElement)
        .map(key => formElement[key])
        .filter(element => elementNames.includes(element.name));

    const errors = await Promise.all(elements.map(async element => {
        const data = (element.getAttribute('data-validations') || '').replace(/'/g, '"');
        const json = xmlToJson(`<xml>${data}</xml>`);
        const validators = json.children;
        const errors = await Promise.all(validators.map(item => validator.call(this, item, element)));
        const valid = errors.filter(bool => bool === null).length === validators.length;
        if (valid) return {};
        return { element, error: errors.find(i => i) };
    }));
    const { element, error } = errors.find(item => item.error) || {};
    if (element) {
        element.focus();
        return Promise.reject(error);
    }
    return Promise.resolve();
};
