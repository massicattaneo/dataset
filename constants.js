const APPLICATION = {
    NAME: 'Dataset',
    VERSION: process.env.PRODUCT_VERSION
};

const PORT = 8095;
const SERVER = {
    ROOT: '/',
    PORT,
    WSS_ORIGIN: `ws://192.168.0.48:${PORT}`
};

const STYLE = {
    WHITE_COLOR: '#ffffff',
    MAIN_COLOR: '#80aec4',
    GREEN_COLOR: '#58be55',
    CONTRAST_COLOR: '#3e3e3e',
    ACCENT_COLOR: '#dca34b',
    SOFT_GRAY_COLOR: '#d4d1d1',
    TEXT_COLOR: '#5a616d',
    TEXT_BG_COLOR: '#e5e5e5',
    FONT_FAMILY: 'Arial Narrow',
    HOME_HEADER_HEIGHT: 29,
    HOME_FOOTER_HEIGHT: 60
};

const API = {
    ACCOUNT: {
        STATUS: '/api/account/status',
        REGISTER: '/api/account/register',
        EXISTS: '/api/account/exists'
    },
    REST: {
        GET: '/api/rest/:table'
    }
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
