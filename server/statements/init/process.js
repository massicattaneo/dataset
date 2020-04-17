const path = require('path');
const { SERVER } = require('../../../constants');

module.exports = function () {
    return {
        process: {
            clientDir: path.resolve(__dirname, '../../../client/'),
            publicPath: SERVER.ROOT,
            isDevelopment: true
        },
        sessions: {}
    };
};
