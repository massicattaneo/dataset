const { loadStyle } = require('./style');
const { loadFont } = require('./font');
const { loadImage } = require('./image');
const { loadScript } = require('./script');

const options = { extraChars: '&#xe803;' };
const DEPENDENCY_TYPES = {
    STYLE: 'style',
    FONT: 'font',
    IMAGE: 'image',
    SCRIPT: 'script',
};
const FONTS_EXTENSIONS = ['ttf', 'woff', 'woff2', 'svg', 'eot'];

const groupFonts = array => {
    const mainFontExtension = FONTS_EXTENSIONS.slice(0).shift();
    const fontDeps = FONTS_EXTENSIONS.slice(0).splice(1);
    const allFontsExtensions = fontDeps.concat(mainFontExtension);
    const ttfFiles = array.filter(item => item.ext === mainFontExtension);
    const othersFontsFiles = array.filter(item => fontDeps.indexOf(item.ext) !== -1);
    const excludeFonts = array.filter(item => allFontsExtensions.indexOf(item.ext) === -1);
    const fontFiles = ttfFiles.map(item => {
        const dependencies = othersFontsFiles.filter(dep => dep.name === item.name);
        return { ...item, dependencies };
    });
    return excludeFonts.concat(fontFiles);
};


const manifest = (array, folders = []) => {
    const stages = [].concat(folders);
    const loaders = groupFonts(array)
        .filter(({ stage }) => stages.indexOf(stage) !== -1)
        .map((file) => {
            if (file.type === DEPENDENCY_TYPES.STYLE) return () => loadStyle(file);
            if (file.type === DEPENDENCY_TYPES.IMAGE) return () => loadImage(file);
            if (file.type === DEPENDENCY_TYPES.FONT) return () => loadFont(file, options);
            if (file.type === DEPENDENCY_TYPES.SCRIPT) return () => loadScript(file);
        });
    return Promise.all(loaders.map(loader => {
        return loader.retry().subscribe();
    }));
};

module.exports = {
    manifest,
    DEPENDENCY_TYPES,
    FONTS_EXTENSIONS
};
