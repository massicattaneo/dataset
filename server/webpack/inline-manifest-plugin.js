const { DEPENDENCY_TYPES, FONTS_EXTENSIONS } = require('../../modules/loaders/manifest');

const objectToArray = obj => {
    return Object.values(obj).reduce((array, item) => {
        return array.concat(item);
    }, []);
};

const getTypeFromExtension = ext => {
    if (ext === 'css') return DEPENDENCY_TYPES.STYLE;
    if (FONTS_EXTENSIONS.indexOf(ext) !== -1) return DEPENDENCY_TYPES.FONT;
};

class InlineManifestPlugin {
    constructor() {
        this.assetsManifest = {};
    }

    apply(compiler) {
        return compiler.hooks.emit.tapAsync('InlineManifestPlugin', (compilation, callback) => {
            const assets = Object.keys(compilation.assets)
                .filter(item => !item.match(/\.html$/))
                .filter(item => item.match(/\//))
                .reduce((obj, url) => {
                    const [, hash] = url.match(/.*\/.*\.(.*)\..*/) || [, ''];
                    const key = url.replace(`.${hash}`, '');
                    const [, name] = key.match(/.*\/(.*)\..*/);
                    const [, ext] = key.match(/.*\/.*\.(.*)/);
                    const type = getTypeFromExtension(ext);
                    const [, stage] = key.match(/[^/]*\/([^/]*)\//);
                    return { ...obj, [key]: { url, name, stage, ext, type } };
                }, {});
            Object.assign(this.assetsManifest, assets);
            const mainBundle = Object.keys(compilation.assets)
                .find(item => item.startsWith('main.'));
            compilation.hooks.htmlWebpackPluginAfterHtmlProcessing.tapAsync('InlineManifestPlugin', async (data, cb) => {
                const manifest = JSON.stringify(objectToArray(this.assetsManifest));
                const replaceValue = `<head><script>window.manifest = ${manifest}</script>`;
                const replaceBundle = `<script type="text/javascript" src="/${mainBundle}"></script></body>`;
                data.html = data.html.replace('<head>', replaceValue);
                data.html = data.html.replace('</body>', replaceBundle);
                cb(null, data);
            });
            callback();
        });
    }
}

module.exports = {
    InlineManifestPlugin
};
