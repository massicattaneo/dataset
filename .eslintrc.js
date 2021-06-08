module.exports = {
    'env': {
        'browser': true,
        'es2021': true,
        'node': true
    },
    'extends': 'eslint:recommended',
    'parserOptions': {
        'ecmaVersion': 12,
        'sourceType': 'module'
    },
    'rules': {
        'semi': [2, 'always'],
        'object-curly-spacing': [2, 'always'],
        'quotes': ['error', 'single'],
        'no-case-declarations': [2, 'none']
    }
};
