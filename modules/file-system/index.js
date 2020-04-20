const fs = require('fs');
const path = require('path');

const createFolderRecursive = absolutePath => {
    const filter = absolutePath.split(path.sep)
        .filter(i => i !== '..')
        .filter(i => i !== 'C:')
        .filter(i => i.trim() !== '');
    filter.forEach((key, index, arr) => {
        const folder = path.sep + arr.slice(0, index)
            .join(path.sep);
        if (folder && !fs.existsSync(folder)) {
            fs.mkdirSync(path.resolve(folder));
        }
    });
};

module.exports = {
    createFolderRecursive
};
