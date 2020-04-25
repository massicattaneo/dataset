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

const config = {
    dependencies: [],
    defaults: { width: 500 }
};

if (params.route) {
    const { route } = params;
    const folders = route.split('/');
    const absolutePath = path.resolve(__dirname, '../../', ROUTES_PATH, folders.join('/'));
    const routes = route.split('/');
    createFolderRecursive(absolutePath);
    fs.writeFileSync(`${absolutePath}.html`, '<div></div>');
    fs.writeFileSync(`${absolutePath}.css`, '.local {}');
    fs.writeFileSync(`${absolutePath}.config.json`, JSON.stringify(config, null, 2));
    fs.writeFileSync(`${absolutePath}.js`,
        `export default async function () {
    const { frame } = this;
    const { store } = this.sharedContext;
}`);
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

