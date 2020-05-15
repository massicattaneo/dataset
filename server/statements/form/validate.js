const { validator } = require('../../../modules/validator/validator');

module.exports = async function (requestBody, formFields) {
    const globPromises = Object.keys(requestBody).map(async field => {
        const { validations = [] } = formFields.find(item => item.name === field) || {};
        const value = requestBody[field];
        const promises = validations.map(async item => {
            const element = { value, checked: value, getAttribute: () => '' };
            const result = await validator.call(this, item, element);
            return result ? result : null;
        }, value);
        const errors = (await Promise.all(promises)).filter(item => item && item.path);
        return errors[0] ? { field, error: errors[0] } : null;
    }, {});
    return (await Promise.all(globPromises)).filter(error => error);
};
