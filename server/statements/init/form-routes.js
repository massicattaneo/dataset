const fs = require('fs');
const path = require('path');
const { parseStatements } = require('../../../modules/thread/thread-utils');
const { xmlToJson, findChildrenRecursive, xmlToSimpleJson } = require('../../../modules/xml/xml');
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
                const itemForm = parent.children.find(item => item.name === 'formatters') || { children: [] };
                const itemVal = parent.children.find(item => item.name === 'validations') || { children: [] };
                const formatters = itemForm.children.map(({ content, attributes }) => ({ content, attributes }));
                const validations = itemVal.children.map(({ content, attributes }) => ({ content, attributes }));
                return { name, formatters, validations };
            });
        }
    });
    return xmls;
};

module.exports = async function () {
    const formRoutes = getFormRoutes();
    return { formRoutes };
};
