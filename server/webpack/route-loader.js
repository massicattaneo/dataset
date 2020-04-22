const path = require('path');
const { getOptions } = require('loader-utils');
const { ROUTES_PATH } = require('../../constants');

async function routeLoader(source) {
    const callback = this.async();
    const options = getOptions(this);
    const filePath = this.currentRequest.split('!').pop();
    const relativePath = path.relative(`${__dirname}/../../${ROUTES_PATH}`, filePath);
    const dirname = path.dirname(relativePath).replace('.', '');
    const basename = path.basename(relativePath);
    const nameNoExt = basename.replace('.js', '');
    const imports = [];
    const fn = [];
    source.split('\n').forEach(line => {
        if (line.startsWith('export default') || fn.length) {
            fn.push(line);
        } else {
            imports.push(line);
        }
    });
    callback(null, `
${imports.join('\n')}
import { pluginBundle } from '../${dirname.split('/').map(() => '../').join('')}modules/bundle';
import style from './${nameNoExt}.css';
import template from './${nameNoExt}.html';

const options = {
    route: 'routes/${relativePath.replace('.js', '')}',
    template,
    style
};

pluginBundle(options, ${fn.join('\n').replace('export default ', '')});
`);
}

module.exports = routeLoader;
