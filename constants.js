const APPLICATION = {
    NAME: 'Dataset',
    VERSION: process.env.PRODUCT_VERSION
};

const SERVER = {
    ROOT: '/',
    PORT: 8095
};

const STYLE = {
    WHITE_COLOR: '#ffffff',
    MAIN_COLOR: '#80aec4',
    CONTRAST_COLOR: '#3e3e3e',
    ACCENT_COLOR: '#dca34b',
    TEXT_COLOR: '#5a616d',
    TEXT_BG_COLOR: '#e5e5e5',
    FONT_FAMILY: 'Arial Narrow',
    HOME_HEADER_HEIGHT: 29,
    HOME_FOOTER_HEIGHT: 60
};

const API = {
    LOGIN_STATUS: '/api/login/status'
};

const ROUTES_PATH = 'routes/';
const DEFAULT_LANGUAGE = 'en';

module.exports = {
    APPLICATION,
    SERVER,
    STYLE,
    API,
    ROUTES_PATH,
    DEFAULT_LANGUAGE
};
