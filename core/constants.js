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
    ACCENT_COLOR: '#475b86',
    TRANSPARENT_COLOR: '#767575c2',
    TEXT_COLOR: '#59312b',
    TEXT_HOVER_COLOR: '#B3DFA5',
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
