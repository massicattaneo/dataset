const appendFontStyle = (name, url) => {
    const queryString = url.lastIndexOf('?') !== -1 ? url.substr(url.lastIndexOf('?')) : '';
    const css = `@font-face {
                            font-family: ${name};
                            src: url('${url.substr(0, url.lastIndexOf('.'))}.woff2${queryString}') format('woff2'),
                            url('${url.substr(0, url.lastIndexOf('.'))}.woff${queryString}') format('woff'),
                            url('${url}${queryString}') format('ttf');
                        }`;
    const head = document.head || document.getElementsByTagName('head')[0];
    const style = document.createElement('style');

    style.type = 'text/css';
    if (style.styleSheet) {
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }

    setTimeout(() => {
        head.appendChild(style);
    }, 0);
    return () => {
        head.removeChild(style);
    };
};

const load = ({ name, url }, extraChars) => {
    const tester = document.createElement('span');
    const testFont = 'Comic Sans MS';
    const maxMs = 30 * 1000;
    tester.style.position = 'absolute';
    tester.style.top = '-9999px';
    tester.style.left = '-9999px';
    tester.style.visibility = 'hidden';
    tester.style.fontFamily = testFont;
    tester.style.fontSize = '250px';
    tester.innerHTML = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghigklmnopqrstuvxyz123456789!@#$%^&*${extraChars}`;
    document.body.appendChild(tester);
    const startWidth = tester.offsetWidth;
    tester.style.fontFamily = `${name}, ${testFont}`;
    const start = Date.now();
    return new Promise((resolve, reject) => {
        const checkFont = () => {
            const loadedFontWidth = tester.offsetWidth;
            const newTime = Date.now();
            if (startWidth === loadedFontWidth && newTime - start <= maxMs) {
                setTimeout(checkFont, 20);
            } else if (newTime - start > maxMs) {
                reject({ url })
            } else {
                resolve();
            }
        };
        checkFont();
    });
};

export const loadFont = ({ name, url }, { extraChars = '' } = {}) => {
    return new Promise((retryResolve, retryReject) => {
        appendFontStyle(name, url);
        load({ name, url }, extraChars)
            .then(retryResolve)
            .catch(retryReject);
    });
};
