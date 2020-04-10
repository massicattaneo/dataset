const padLeft = (str, size, char = '0') => {
    if (size === 0) {
        return '';
    }
    return (Array(size + 1).join(char) + str).slice(-size);
};

const capitalize = (s) => {
    if (typeof s !== 'string') return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
};

const toArray = string => {
    if (string.includes('_')) return string.split('_');
    if (string.includes('-')) return string.split('-');
    if (string.toUpperCase() === string) return string;
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

const toSnakelCase = string => {
    const array = toArray(string);
    return array.map(capitalize).join('');
};

module.exports = {
    padLeft,
    toCamelCase,
    toDashCase,
    toSnakelCase,
    capitalize

};
