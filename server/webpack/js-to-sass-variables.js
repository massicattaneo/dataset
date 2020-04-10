const { toCamelCase } = require('../../modules/string/string');

const formatValue = value => {
    if (value === '') return value;
    if (!isNaN(value)) return `${value}px`;
    return value;
};

const jsToSass = jsObj => {
    const result = Object.keys(jsObj).map(key => `$${toCamelCase(key)}: ${(formatValue(jsObj[key]))}`).join(';');
    console.warn(result)
    return `${result};`;
};

module.exports = {
    jsToSass
};
