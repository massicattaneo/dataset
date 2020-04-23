const wait = {
    time: time => {
        return new Promise(resolve => {
            setTimeout(resolve, time);
        });
    },
    cssTransition: (element, timeout = 550) => new Promise(resolve => {
        const onTransitionEnd = () => {
            element.removeEventListener('transitionend', onTransitionEnd, false);
            setTimeout(resolve, 200);
        };
        element.addEventListener('transitionend', onTransitionEnd, false);
        setTimeout(resolve, timeout);
    })
};

module.exports = { wait };
