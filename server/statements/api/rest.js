const { requiresLogin } = require('../../utils/middlewares');
const { API } = require('../../../constants');
module.exports = async function () {
    const { app, db } = this;

    app.get(
        API.REST.GET,
        requiresLogin(),
        (request, response) => {
            const { table } = request.params;
            response.json(db.rest.get(table, request.query));
        });

};
