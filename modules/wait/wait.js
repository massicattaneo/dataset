const wait = {
    time: time => {
        return new Promise(resolve => {
            setTimeout(resolve, time);
        });
    },
    cssTransition: (element, timeout = 1000) => new Promise(resolve => {
        const onTransitionEnd = () => {
            element.removeEventListener('transitionend', onTransitionEnd, false);
            setTimeout(resolve, 200);
        };
        element.addEventListener('transitionend', onTransitionEnd, false);
        setTimeout(resolve, timeout);
    }),
    cssAnimation: (element, timeout = 1000) => new Promise(resolve => {
        const onAnimationEnd = () => {
            element.removeEventListener('animationend', onAnimationEnd, false);
            resolve();
        };
        element.addEventListener('animationend', onAnimationEnd, false);
        setTimeout(resolve, timeout);
    })
};

module.exports = { wait };
