const fs = require('fs');
const { parseStatements } = require('../../../core/core-utils');
const { xmlToLocales } = require('../../../modules/localization/localization');

const getLocales = () => {
    const localeDir = `${__dirname}/../../../locales/`;
    const xml = fs.readdirSync(localeDir).reduce((acc, file) => {
        return { ...acc, [file]: fs.readFileSync(`${localeDir}${file}`, 'utf8') };
    }, {});
    const context = function (key) {
        return xml[key];
    };
    context.keys = function () {
        return Object.keys(xml);
    };
    const localesXml = parseStatements(context, '.xml');
    const allLocales = Object.values(localesXml).map(string => string.replace(/<locales>/, '').replace(/<\/locales>/, ''));
    return xmlToLocales(`<locales>${allLocales}</locales>`);
};

const loc = getLocales();

module.exports = async function () {
    this.app.get('/locale/:version/:language', (req, res) => {
        const { language } = req.params;
        const locale = this.process.isDevelopment ? getLocales() : loc;
        return res.json(locale[language]);
    });
};