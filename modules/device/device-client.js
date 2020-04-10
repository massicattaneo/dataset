const hasOnTouchStart = 'ontouchstart' in window;
const touchType = hasOnTouchStart ? 'mobile' : 'desktop';
const isMobile = hasOnTouchStart;
const isDesktop = !(hasOnTouchStart);

module.exports = {
    touchType,
    isMobile,
    isDesktop
};
