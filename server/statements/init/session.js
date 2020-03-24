const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const secret = '$eCuRiTy';

module.exports = function () {
    const { db, app } = this;

    const sessionParser = session({
        saveUninitialized: false,
        secret,
        resave: false,
        name: 'reporter.sid',
        store: new MongoStore({
            client: db.client,
            dbName: 'inspector',
            secret,
            collection: 'sessions'
        })
    });
    app.use(sessionParser);

    return { sessionParser };
};
