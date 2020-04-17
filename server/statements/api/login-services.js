const { API } = require('../../../constants');

module.exports = async function () {
    const { app } = this;
    app.get(API.LOGIN_STATUS, (request, response) => {
        response.json({});
    });
};
