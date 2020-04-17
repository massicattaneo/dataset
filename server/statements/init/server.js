const fs = require('fs');
const http = require('http');
const { SERVER } = require('../../../constants');

module.exports = function () {
    const { app } = this;
    const httpsServer = http.createServer(app);

    const server = {
        listen: async () => {
            httpsServer.listen(SERVER.PORT);
            console.log('SERVER LISTENING ON PORT', SERVER.PORT);
        },
        onUpgrade: (...args) => httpsServer.on('upgrade', ...args)
    };

    return { server };
};
