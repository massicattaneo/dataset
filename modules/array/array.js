const findIndex = (array, callback) => {
    const element = array.find(callback);
    if (!element) return;
    return array.indexOf(element);
};

module.exports = {
    findIndex
};
