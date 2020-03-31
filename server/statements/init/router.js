const path = require('path');
const express = require('express');

const staticOptions = {
    maxage: 365 * 24 * 60 * 60 * 1000,
    etag: false
};

module.exports = async function () {
    const staticPath = path.join(__dirname, '/../../static/');
    this.app.use(express.static(staticPath, staticOptions));

    this.app.get('*', (req, res) => {
        res.sendFile(`${staticPath}/index.html`);
    });
};
