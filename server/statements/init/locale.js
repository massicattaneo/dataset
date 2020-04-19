const fs = require('fs');
const path = require('path');
const { parseStatements } = require('../../../modules/thread/thread-utils');
const { xmlToLocales } = require('../../../modules/localization/localization');
const { cache } = require('../../utils/cache-middleware');
const requireContext = require('require-context');
const { ROUTES_PATH } = require('../../../constants');

const getLocales = () => {
    const localeDir = `${__dirname}/../../../routes`;
    const context = requireContext(path.resolve(localeDir), true, /\.xml/);
    const localesXml = parseStatements(context, '.xml', {
        resolver: fileName => {
            const xmlString = fs.readFileSync(path.resolve(localeDir, fileName), 'utf8');
            return xmlString.replace(new RegExp(`@routes`, 'g'), `${ROUTES_PATH}${fileName.replace('.xml', '')}`);
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
