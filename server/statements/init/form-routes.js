const fs = require('fs');
const path = require('path');
const { parseStatements } = require('../../../modules/thread/thread-utils');
const { xmlToJson, findChildrenRecursive } = require('../../../modules/xml/xml');
const requireContext = require('require-context');
const { ROUTES_PATH } = require('../../../constants');

const getFormRoutes = () => {
    const localeDir = `${__dirname}/../../../routes`;
    const context = requireContext(path.resolve(localeDir), true, /\.html/);
    const xmls = parseStatements(context, '.html', {
        resolver: fileName => {
            const xmlString = fs.readFileSync(path.resolve(localeDir, fileName), 'utf8');
            const json = xmlToJson(xmlString);
            return [
                ...findChildrenRecursive(json, 'iinput'),
                ...findChildrenRecursive(json, 'iswitcher'),
                ...findChildrenRecursive(json, 'irange')
            ].map(parent => {
                const { content: name = '' } = parent.children.find(item => item.name === 'name') || {};
                const { content: formatters = '' } = parent.children.find(item => item.name === 'formatters') || {};
                const { content: validations = '' } = parent.children.find(item => item.name === 'validations') || {};
                return { name, formatters, validations };
            });
        }
    });
    const xml = xmls['account/register/index'];
    console.warn(xml[0]);
    return xmls;
};

module.exports = async function () {
    const formRoutes = getFormRoutes();
    return { formRoutes };
};
