const { createSignature } = require('../../crypto-utils');
const { API, HTTP_STATUSES, DB } = require('../../../constants');
const { hasWebSocketSignature } = require('../../utils/middlewares');

module.exports = async function () {
    const { app, formRoutes, thread, db, webSocket } = this;

    app.get(API.ACCOUNT.STATUS,
        hasWebSocketSignature(this),
        (request, response) => {
            response.json({});
        });

    app.get(API.ACCOUNT.EXISTS,
        hasWebSocketSignature(this),
        async (request, response) => {
            const { db } = this;
            const table = DB.TABLES.ACCOUNTS;
            const { query } = request;
            const user = await db.rest.get(table, query);
            await response.json({ exists: user.length > 0, query, table });
        });

    app.post(API.ACCOUNT.REGISTER,
        hasWebSocketSignature(this),
        async (request, response) => {
            const formFields = formRoutes['account/register/index'];
            const requestBodyFormatted = await thread.main('form/format', request.body, formFields).subscribe();
            const errors = await thread.main('form/validate', requestBodyFormatted, formFields).subscribe();
            if (errors.length) {
                return response.status(HTTP_STATUSES.INVALID_VALIDATION).send(errors);
            }
            const body = { ...requestBodyFormatted, password: createSignature(requestBodyFormatted.password) };
            return response.json(await db.rest.post(DB.TABLES.ACCOUNTS, body));
        });


    app.post(API.ACCOUNT.LOGIN,
        hasWebSocketSignature(this),
        async (request, response) => {
            const formFields = formRoutes['account/login/index'];
            const requestBodyFormatted = await thread.main('form/format', request.body, formFields).subscribe();
            const errors = await thread.main('form/validate', requestBodyFormatted, formFields).subscribe();
            if (errors.length) {
                return response.status(HTTP_STATUSES.INVALID_VALIDATION).send(errors);
            }
            const password = createSignature(requestBodyFormatted.password);
            const [user] = await db.rest.get(DB.TABLES.ACCOUNTS, { password });
            if (!user) {
                const error = 'notifications/warn/password-incorrect';
                return response.status(HTTP_STATUSES.UNAUTHORIZED).send([{
                    field: 'password',
                    error: { path: error }
                }]);
            }
            return response.json({});
        });
};
