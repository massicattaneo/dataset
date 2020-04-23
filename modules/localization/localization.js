const { xmlToJson, jsonToXml } = require('../xml/xml');

function xmlToLocales(localesXml) {
    const loc = xmlToJson(localesXml);

    const languages = loc.children.reduce(function (arr, item) {
        return arr.concat(item.children.map(o => o.name));
    }, []).filter((o, i, a) => a.indexOf(o) === i);

    return loc.children.reduce((acc, item) => {
        languages.forEach(function (language) {
            const find = item.children.find(o => o.name === language) || { content: '', children: [] };
            acc[language] = acc[language] || {};
            const paths = item.attributes.path.split('/');
            const id = paths.splice(paths.length - 1, 1);
            const obj = paths.reduce((acc, path) => {
                acc[path] = acc[path] || {};
                return acc[path];
            }, acc[language]);
            obj[id] = find.content + find.children.map(jsonToXml).join('');
        });
        return acc;
    }, {});
}


module.exports = {
    xmlToLocales
};
