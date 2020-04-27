import { emailRegEx } from '../../modules/regexp/regexp';

const types = {
    required: (element, params) => {
        return !element.value ? { path: 'notifications/warn/required', ...params } : null;
    },
    email: (element, params) => {
        return !element.value.match(emailRegEx) ? { path: 'notifications/warn/wrong-format', ...params } : null;
    },
    length: (element, params, minLength) => {
        return element.value.toString().length < minLength ? { path: 'notifications/warn/min-length', ...params, minLength } : null;
    },
    checked: (element, params) => {
        return !element.checked ? { path: 'notifications/warn/wrong-format', ...params } : null;
    }
};

export default function (element, validations) {
    const params = { placeholder: element.getAttribute('data-placeholder'), timeout: 3000 };
    const errors = validations
        .map(key => {
            const [fnName, ...args] = key.split('|');
            const type = types[fnName] || (() => true);
            return type(element, params, ...args);
        });
    const valid = errors.filter(bool => bool === null).length === validations.length;
    if (valid) return Promise.resolve();
    element.focus();
    return Promise.reject(errors.find(i => i));
};
