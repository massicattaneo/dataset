const presets = [
    [
        '@babel/env',
        {
            targets: {
                edge: '17',
                firefox: '60',
                chrome: '67',
                safari: '11.1'
            }
        }
    ]
];

const plugins = [
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-transform-runtime',
    'babel-plugin-add-module-exports',
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-proposal-decorators'
];

module.exports = { presets, plugins };
