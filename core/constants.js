const APPLICATION = {
    NAME: 'Dataset',
    VERSION: process.env.PRODUCT_VERSION
};

const SERVER = {
    ROOT: '/',
    PORT: 8095
};

const STYLE = {
    MAIN_COLOR: '#819dab',
    CONTRAST_COLOR: '#3e3e3e',
    ACCENT_COLOR: '#DC911F',
    TEXT_COLOR: '#590000',
    TEXT_BG_COLOR: '#e5e5e5',
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
