const { formatter } = require('../../../modules/formatter/formatter');

module.exports = async function (requestBody, formFields) {
    return Object.keys(requestBody).reduce((obj, key) => {
        const { formatters = [] } = formFields.find(item => item.name === key) || {};
        const value = requestBody[key];
        return { ...obj, [key]: formatters.reduce((string, item) => formatter(item, string), value) };
    }, {});
};
