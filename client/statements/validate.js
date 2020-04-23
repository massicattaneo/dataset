import { emailRegEx } from '../../modules/regexp/regexp';

const types = {
    required: (item, params) => {
        return !item ? { path: 'notifications/warn/required', ...params } : null;
    },
    email: (item, params) => {
        return !item.match(emailRegEx) ? { path: 'notifications/warn/wrong-format', ...params } : null;
    }
};

export default function (element, validations) {
    const params = { placeholder: element.getAttribute('data-placeholder'), timeout: 3000 };
    const string = element.value;
    const errors = validations.map(key => {
        const type = types[key] || (() => true);
        return type(string, params);
    });
    const valid = errors.filter(bool => bool === null).length === validations.length;
    if (valid) return Promise.resolve();
    element.focus();
    return Promise.reject(errors.find(i => i));
};
