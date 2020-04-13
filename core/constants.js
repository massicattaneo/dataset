const APPLICATION = {
    NAME: 'Dataset',
    VERSION: process.env.PRODUCT_VERSION
};

const SERVER = {
    ROOT: '/',
    PORT: 8095
};

const STYLE = {
    MAIN_COLOR: '#b5ccd8',
    TEXT_COLOR: '#590000',
    CONTRAST_COLOR: '#3e3e3e',
    TEXT_BG_COLOR: '#cccccc',
    ACCENT_COLOR: '#7380d2',
    TRANSPARENT_COLOR: '#767575c2',
    FONT_FAMILY: 'Arial Narrow',
    HOME_HEADER_HEIGHT: 29,
    HOME_FOOTER_HEIGHT: 60
};

const API = {
    LOGIN_STATUS: '/api/login/status'
};

module.exports = {
    APPLICATION,
    SERVER,
    STYLE,
    API
};
