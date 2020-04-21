const loadScript = ({ url}) =>
    new Promise((resolve, reject) => {
        const scriptEl = document.createElement('script');
        scriptEl.async = true;
        document.head.appendChild(scriptEl);
        scriptEl.addEventListener('load', resource => {
            resolve(resource);
        });
        scriptEl.addEventListener('error', error => {
            reject(error);
        });
        scriptEl.src = url;
    });

module.exports = {
    loadScript
};
