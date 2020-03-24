function parseStatements(context, extension) {
    const statements = {};
    context.keys().forEach(filename => {
        statements[filename.replace('./', '').replace(extension, '')] = context(filename).default || context(filename);
    });
    return statements;
}

module.exports = {
    parseStatements
};
