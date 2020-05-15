const { fetchGetJSON } = require('../../client/fetch-utils');
const { emailRegEx } = require('../regexp/regexp');
const isNodeProcess = !global.document;
const { DB, API } = require('../../constants');

const validators = {
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
    accountEmailExists: async (element, params, attributes, { db }) => {
        const path = 'notifications/warn/email-do-not-exists';
        if (isNodeProcess) {
            const user = await db.rest.get(DB.TABLES.ACCOUNTS, { email: element.value });
            return user.length === 0 ? { path, ...params } : null;
        } else {
            const url = `${API.ACCOUNT.EXISTS}?email=${element.value}`;
            const res = await fetchGetJSON(url);
            return !res.exists ? { path, ...params } : null;
        }
    },
    accountEmailDoNotExists: async (element, params, attributes, { db }) => {
        const path = 'notifications/warn/email-exists';
        if (isNodeProcess) {
            const user = await db.rest.get(DB.TABLES.ACCOUNTS, { email: element.value });
            return user.length > 0 ? { path, ...params } : null;
        } else {
            const url = `${API.ACCOUNT.EXISTS}?email=${element.value}`;
            const res = await fetchGetJSON(url);
            return res.exists ? { path, ...params } : null;
        }
    }
};

const validator = function ({ content, attributes }, element) {
    const params = { placeholder: element.getAttribute('data-placeholder'), timeout: 3000 };
    if (!validators[content]) return true;
    return validators[content](element, params, attributes, this);
};

module.exports = {
    validator
};
