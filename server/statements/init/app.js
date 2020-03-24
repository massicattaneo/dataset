const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

module.exports = function () {
    const app = express();
    app.use(cookieParser());
    app.use('*', function (req, res, next) {
        res.header('Access-Control-Allow-Origin', '*'); // update to match the domain you will make the request from
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        next();
    });
    app.use(bodyParser.json({ limit: '16mb' }));
    app.use(bodyParser.text());
    app.use(bodyParser.urlencoded({ extended: false, limit: '16mb' }));

    return { app };
};
