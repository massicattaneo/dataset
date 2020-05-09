const padLeft = (str, size, char = '0') => {
    if (size === 0) {
        return '';
    }
    return (Array(size + 1).join(char) + str).slice(-size);
};

const capitalize = (s) => {
    if (typeof s !== 'string') return '';
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
};

const toArray = string => {
    if (string.includes(' ')) return string.split(' ');
    if (string.includes('_')) return string.split('_');
    if (string.includes('-')) return string.split('-');
    if (string.toUpperCase() === string) return [string];
    if (string.toLowerCase() === string) return [string];
    return string.match(/[A-Z][a-z]+/g);
};

const toCamelCase = string => {
    const array = toArray(string);
    const lower = array.map(s => s.toLowerCase());
    return `${lower.shift()}${lower.map(capitalize).join('')}`;
};

const toDashCase = string => {
    const array = toArray(string);
    return array.map(capitalize).join('');
};

const toSnakeCase = string => {
    const array = toArray(string);
    return array.map(capitalize).join('');
};

const toSpaceCase = string => {
    const array = toArray(string);
    return array.join(' ');
};

const objectToString = obj => {
    const sequence = Object.keys(obj).map(key => `${key}: '${obj[key]}'`).join(',');
    return `{${sequence}}`;
};

const evalString = string => {
    if (!string) return '';
    if (string.toString() === 'true') return true;
    if (string.toString() === 'false') return false;
    if (!isNaN(string)) return Number(string);
    return string;
};

module.exports = {
    padLeft,
    toCamelCase,
    toDashCase,
    toSnakeCase,
    toSpaceCase,
    capitalize,
    objectToString,
    evalString
};
