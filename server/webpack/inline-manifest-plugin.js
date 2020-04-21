const { DEPENDENCY_TYPES, FONTS_EXTENSIONS } = require('../../modules/loaders/manifest');

const objectToArray = obj => {
    return Object.values(obj).reduce((array, item) => {
        return array.concat(item);
    }, []);
};

const getTypeFromExtension = ext => {
    if (ext === 'css') return DEPENDENCY_TYPES.STYLE;
    if (ext === 'png') return DEPENDENCY_TYPES.IMAGE;
    if (ext === 'jpg') return DEPENDENCY_TYPES.IMAGE;
    if (ext === 'jpeg') return DEPENDENCY_TYPES.IMAGE;
    if (FONTS_EXTENSIONS.indexOf(ext) !== -1) return DEPENDENCY_TYPES.FONT;
};

class InlineManifestPlugin {
    constructor() {
        this.assetsManifest = {};
        this.chunksManifest = {};
    }

    apply(compiler) {
        return compiler.hooks.emit.tapAsync('InlineManifestPlugin', (compilation, callback) => {
            const chunks = compilation.chunks.reduce((obj, chunk) => {
                const name = chunk.id;
                return { ...obj, [name]: { url: `/${chunk.files[0]}`, name, stage: name,  ext: '.js', type: DEPENDENCY_TYPES.SCRIPT} };
            }, {});
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
                    return { ...obj, [key]: { url: `/${url}`, name, stage, ext, type } };
                }, {});
            Object.assign(this.assetsManifest, assets);
            Object.assign(this.chunksManifest, chunks);
            const mainBundle = Object.keys(compilation.assets)
                .find(item => item.startsWith('main.'));
            compilation.hooks.htmlWebpackPluginAfterHtmlProcessing.tapAsync('InlineManifestPlugin', async (data, cb) => {
                const manifest = JSON.stringify(objectToArray(this.assetsManifest));
                const chunksManifest = JSON.stringify(objectToArray(this.chunksManifest));
                const replaceValue = `<head><script>window.app={};window.app.assetsManifest = ${manifest};window.app.chunksManifest=${chunksManifest}</script>`;
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
