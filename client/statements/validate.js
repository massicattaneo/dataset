import { emailRegEx } from '../../modules/regexp/regexp';
import { fetchGetJSON } from '../fetch-utils';

const types = {
    required: (element, params) => {
        return !element.value ? { path: 'notifications/warn/required', ...params } : null;
    },
    email: (element, params) => {
        return !element.value.match(emailRegEx) ? { path: 'notifications/warn/wrong-format', ...params } : null;
    },
    length: (element, params, minLength) => {
        return element.value.toString().length < minLength ? {
            path: 'notifications/warn/min-length', ...params,
            minLength
        } : null;
    },
    checked: (element, params) => {
        return !element.checked ? { path: 'notifications/warn/wrong-format', ...params } : null;
    },
    fetchGet: async (element, params, api, field, value, path) => {
        const url = api.replace('$1', element.value);
        const res = await fetchGetJSON(url);
        return res[field].toString() !== value ? { path, ...params } : null;
    }
};

export default async function (element, validations) {
    const params = { placeholder: element.getAttribute('data-placeholder'), timeout: 3000 };
    const errors = await Promise.all(validations
        .map(key => {
            const [fnName, ...args] = key.split('|');
            const type = types[fnName] || (() => true);
            return type(element, params, ...args);
        }));
    const valid = errors.filter(bool => bool === null).length === validations.length;
    if (valid) return Promise.resolve();
    element.focus();
    return Promise.reject(errors.find(i => i));
};
