const findIndex = (array, callback) => {
    const element = array.find(callback);
    if (!element) return;
    return array.indexOf(element);
};

const flat = function (array, depth = 1) {
    const flattend = [];
    const recursive = (innerArray, innerDepth) => {
        for (let el of innerArray) {
            if (Array.isArray(el) && innerDepth > 0) {
                recursive(el, innerDepth - 1);
            } else {
                flattend.push(el);
            }
        }
    };
    recursive(array, Math.floor(depth));
    return flattend;
};

const arrayToObject = (array, key, value) => {
    return array.reduce((obj, item) => ({ ...obj, [item[key]]:item[value] }), {});
};

module.exports = {
    findIndex,
    flat,
    arrayToObject
};
