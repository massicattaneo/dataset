const defaultValue = function (value, param) {
    return value || param;
};

const toPixels = function (value) {
    return `${value}px`;
};

module.exports = {
    defaultValue,
    toPixels
};
