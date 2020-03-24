const { userAgent } = navigator;
const isChromeBrowser = /CriOS|Chrome/.test(userAgent);
const isOtherAndroidBrowser =
    /Mozilla\/5.0/.test(userAgent) && /Android/.test(userAgent) && /AppleWebKit/.test(userAgent) && !isChromeBrowser;

const waitForCss = params => {
    const maxWaitTime = 1000;
    const stepTime = 50;
    let alreadyWaitedTime = 0;

    const nextStep = () => {
        const startTime = Date.now();
        let endTime;

        setTimeout(
            timeOutParam => {
                endTime = +new Date();
                alreadyWaitedTime += endTime - startTime;
                if (alreadyWaitedTime >= maxWaitTime && timeOutParam.error) {
                    timeOutParam.error();
                } else if (window.getComputedStyle(document.body).marginTop === '0px') {
                    timeOutParam.success();
                } else {
                    nextStep();
                }
            },
            stepTime,
            params
        );
    };

    nextStep();
};

export const loadCss = ({ url }) => {
    return new Promise(function (resolve, reject) {
        const css = document.createElement('link');
        css.setAttribute('rel', 'stylesheet');
        css.setAttribute('type', 'text/css');
        css.setAttribute('href', url);
        document.head.insertBefore(css, document.head.children[0] || null);

        const onload = () => resolve();
        const onerror = error => reject(error);

        if (isOtherAndroidBrowser || !('onload' in css)) {
            waitForCss({
                success: onload,
                error: onerror
            });
        } else {
            css.onerror = onerror;
            css.onload = onload;
        }
    });
};
