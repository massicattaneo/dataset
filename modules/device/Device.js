const device = (userAgent = navigator.userAgent) => {
    return {
        type: 'ontouchstart' in window ? 'mobile' : 'desktop'
    };
};

module.exports = {
    device
};
