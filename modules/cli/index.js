const fs = require('fs');
const path = require('path');
const { createFolderRecursive } = require('../file-system');
const { ROUTES_PATH } = require('../../constants');

const argv = process.argv
    .filter(val => val.indexOf('node/') === -1)
    .filter(val => val.indexOf('node.exe') === -1)
    .filter(val => val.indexOf('cli/') === -1)
    .filter(val => val.indexOf('bin.js') === -1);

const options = argv
    .filter(val => val.startsWith('--'))
    .reduce((obj, val) => ({ ...obj, [val.replace('--', '')]: true }), {});

const params = argv
    .filter(val => !val.startsWith('--'))
    .reduce((obj, val) => ({ ...obj, [val.split('=')[0]]: val.split('=')[1] }), {});

if (params.route) {
    const { route } = params;
    const folders = route.split('/');
    const absolutePath = path.resolve(__dirname, '../../', ROUTES_PATH, folders.join('/'));
    createFolderRecursive(absolutePath);
    fs.writeFileSync(`${absolutePath}.html`, '<div></div>');
    fs.writeFileSync(`${absolutePath}.css`, '.local {}');
    fs.writeFileSync(`${absolutePath}.js`, `
import { pluginBundle } from '../../modules/bundle';
pluginBundle('routes/${route}', async function ({ frame }) {
    const { store } = this;
});
    `);
    fs.writeFileSync(`${absolutePath}.xml`, `<locales>
    <locale path="@routes/href">
        <en></en>
        <es></es>
        <it></it>
    </locale>
    <locale path="@routes/title">
        <en></en>
        <es></es>
        <it></it>
    </locale>
</locales>`);
}

