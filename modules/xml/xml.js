const { tagRegEx,tagNameRegEx,attributesRegEx } = require('../regexp/regexp');

const createChild = (name, parent) => {
    const ret = {
        name,
        children: [],
        attributes: {},
        parent,
        content: '',
        autoClosing: false
    };
    return ret;
};

const convertValue = value => {
    const ret = value.toString()
        .replace(/"/g, '')
        // .replace(/'/g, '')
        .trim();
    if (value.indexOf('px') !== -1) {
        return `${Number(ret.replace('px', ''))}px`;
    }
    return isNaN(ret) ? ret : (Number(ret));
};

const xmlToJson = (svgString, root = false) => {
    const target = createChild('root');
    let ref = target;
    svgString.replace(/\n/g, '')
        .replace(/\s\s/g, '')
        .match(tagRegEx)
        .forEach(function (line) {
            if (!line.match(/^<\//) && line.match(/^</)) {
                const item = createChild(line.match(tagNameRegEx)[1].replace('/', ''), ref);
                item.autoClosing = line.endsWith('/>');
                const attr = line.match(attributesRegEx);
                if (attr) {
                    attr.forEach(function (a) {
                        const [name, ...values] = a.split('=');
                        item.attributes[name.trim()] = convertValue(values.join('='));
                    });
                }
                ref.children.push(item);
                if (line.indexOf('/>') === -1) {
                    ref = item;
                }
            } else if (line.match(/^<\//)) {
                ref = ref.parent || target;
            } else {
                ref.content += line.trim();
            }
        });
    return root ? target : target.children[0];
};

const jsonToXml = json => {
    const children = json.children.length ? json.children.map(jsonToXml).join('\n') : '';
    const content = json.content.trim() ? `${json.content.trim()} ` : '';
    return `<${json.name} ${Object.keys(json.attributes).map(n => `${n}="${json.attributes[n]}"`).join(' ')}>${content.trim()}${children.trim()}</${json.name}> `;
};

const xmlToSimpleJson = xml => {
    const structure = xmlToJson(xml);
    return structure.children.reduce((acc, item) => {
        const content = item.content + item.children.map(jsonToXml).join('');
        return { ...acc, [item.name]: content };
    }, {});
};

const findChildrenRecursive = (xmlJson, name, found = []) => {
    if (xmlJson.name === name) return found.push(xmlJson);
    xmlJson.children.forEach(child => findChildrenRecursive(child, name, found));
    return found;
};

module.exports = {
    xmlToJson,
    jsonToXml,
    xmlToSimpleJson,
    findChildrenRecursive
};
