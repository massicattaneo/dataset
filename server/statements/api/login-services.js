const { API } = require('../../../core/constants');
const { OWNERS } = require('../../../customization/properties');

module.exports = async function () {
    const { app } = this;
    app.get(API.LOGIN_STATUS, (request, response) => {
    });


};
