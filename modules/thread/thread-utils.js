function parseStatements(context, extension, { prefixPath = '', resolver } = {}) {
    const statements = {};
    context.keys().forEach(filename => {
        const filePath = filename.replace('./', '').replace(extension, '');
        const path = `${prefixPath}${filePath}`;
        if (resolver) {
            statements[path] = resolver(`${filePath}${extension}`);
        } else {
            statements[path] = context(filename).default || context(filename);
        }
    });
    return statements;
}

module.exports = {
    parseStatements
};
