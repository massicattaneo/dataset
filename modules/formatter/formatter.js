const { capitalize } = require('../string/string');
const isNodeProcess = !global.document;

const formatters = {
    capitalize,
    lowerCase: string => string.toLowerCase(),
    upperCase: string => string.toUpperCase(),
    encoded: string => {
        if (isNodeProcess) return Buffer.from(string, 'base64').toString();
        return btoa(string);
    }
};

const formatter = ({ content }, string) => {
    if (!formatters[content]) return string;
    return formatters[content](string);
};

module.exports = {
    formatter
};
