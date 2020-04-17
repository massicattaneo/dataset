const fs = require('fs');
const path = require('path');
const { parseStatements } = require('../../../modules/thread/thread-utils');
const { xmlToLocales } = require('../../../modules/localization/localization');
const { cache } = require('../../utils/cache-middleware');
const requireContext = require('require-context');

const getLocales = () => {
    const localeDir = `${__dirname}/../../../routes/`;
    const context = requireContext(path.resolve(localeDir), true, /\.xml/);
    // const xml = fs.readdirSync(localeDir)
    //     .filter(file => file.endsWith('.xml'))
    //     .reduce((acc, file) => {
    //         const xmlString = fs.readFileSync(`${localeDir}${file}`, 'utf8');
    //         const string = xmlString.replace(/@route/g, 'index/hhh');
    //         return { ...acc, [file]: string };
    //     }, {});
    // const allXml = { ...xml };
    // const context = function (key) {
    //     return allXml[key];
    // };
    // context.keys = function () {
    //     return Object.keys(allXml);
    // };
    const localesXml = parseStatements(context, '.xml', {
        resolver: fileName => {
            return fs.readFileSync(path.resolve(localeDir, fileName), 'utf8');
        }
    });
    const allLocales = Object.values(localesXml).map(string => string.replace(/<locales>/, '').replace(/<\/locales>/, ''));
    return xmlToLocales(`<locales>${allLocales}</locales>`);
};

const loc = getLocales();

module.exports = async function () {
    this.app.get('/locale/:version/:language',
        cache(this),
        (req, res) => {
            const { language } = req.params;
            const locale = this.process.isDevelopment ? getLocales() : loc;
            return res.json(locale[language]);
        });
};
