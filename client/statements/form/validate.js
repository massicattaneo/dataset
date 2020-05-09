import { emailRegEx } from '../../../modules/regexp/regexp';
import { fetchGetJSON } from '../../fetch-utils';
import { API } from '../../../constants';
import { xmlToJson } from '../../../modules/xml/xml';

const types = {
    required: (element, params) => {
        return !element.value ? { path: 'notifications/warn/required', ...params } : null;
    },
    email: (element, params) => {
        return !element.value.match(emailRegEx) ? { path: 'notifications/warn/wrong-format', ...params } : null;
    },
    length: (element, params, attributes) => {
        return element.value.toString().length < Number(attributes['min-length']) ? {
            path: 'notifications/warn/min-length', ...params,
            minLength: attributes['min-length']
        } : null;
    },
    checked: (element, params) => {
        return !element.checked ? { path: 'notifications/warn/wrong-format', ...params } : null;
    },
    fetchGet: async (element, params, attributes) => {
        const { href, field, value, path } = attributes;
        const url = href.replace('$1', element.value);
        const res = await fetchGetJSON(url);
        return res[field].toString() !== value ? { path, ...params } : null;
    }
};

export default async function (formElement, elementNames) {
    const elements = Object.keys(formElement)
        .map(key => formElement[key])
        .filter(element => elementNames.includes(element.name));

    const errors = await Promise.all(elements.map(async element => {
        const data = (element.getAttribute('data-validations') || '').replace(/'/g, '"');
        const json = xmlToJson(`<xml>${data}</xml>`);
        const validations = json.children;
        const params = { placeholder: element.getAttribute('data-placeholder'), timeout: 3000 };
        const errors = await Promise.all(validations
            .map(({ content: fnName, attributes }) => {
                const type = types[fnName] || (() => true);
                return type(element, params, attributes);
            }));
        const valid = errors.filter(bool => bool === null).length === validations.length;
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
