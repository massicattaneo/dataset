const padLeft = (str, size, char = '0') => {
    if (size === 0) {
        return '';
    }
    return (Array(size + 1).join(char) + str).slice(-size);
};

module.exports = {
    padLeft
};
