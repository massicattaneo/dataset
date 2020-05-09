const { API } = require('../../../constants');

module.exports = async function () {
    const { app, db } = this;

    app.get(API.ACCOUNT.STATUS, (request, response) => {
        response.json({});
    });

    app.get(API.ACCOUNT.EXISTS, (request, response) => {
        const { email = '' } = request.query;
        const user = db.rest.get('users', { email });
        response.json({ email, exists: user.length > 0 });
    });

    app.post(API.ACCOUNT.REGISTER, (request, response) => {
        const { firstname, surname, email, password } = request.body;
        response.json(request.body);
    });

};
