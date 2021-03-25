const APPLICATION = {
    NAME: 'Live',
    VERSION: process.env.PRODUCT_VERSION
};

const PORT = 8095;
const HOSTNAME = '192.168.0.37';
// const HOSTNAME = 'localhost';
const HOST = `${HOSTNAME}${PORT ? `:${PORT}` : ''}`;
const SERVER = {
    ROOT: '/',
    PORT,
    WSS_ORIGIN: `ws://${HOST}`,
    HTTPS_ORIGIN: `http://${HOST}`
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

const API_ROOT = '/api';
const API = {
    ROOT: API_ROOT,
    ACCOUNT: {
        STATUS: `${API_ROOT}/account/status`,
        REGISTER: `${API_ROOT}/account/register`,
        LOGIN: `${API_ROOT}/account/login`,
        EXISTS: `${API_ROOT}/account/exists`
    },
    REST: {
        GET: '/api/rest/:table'
    }
};

const HTTP_STATUSES = {
    OK: 200,
    CREATED: 201,
    INVALID_VALIDATION: 422,
    UNAUTHORIZED: 401
};

const DB = {
    TABLES: {
        ACCOUNTS: 'accounts'
    }
};

const WS = {
    MESSAGES: {
        CONNECTED: 'connected',
        HEARTBEAT: 'heartbeat'
    }
}

const ROUTES_PATH = 'routes/';
const DEFAULT_LANGUAGE = 'en';

module.exports = {
    APPLICATION,
    SERVER,
    STYLE,
    API,
    ROUTES_PATH,
    DEFAULT_LANGUAGE,
    HTTP_STATUSES,
    DB,
    WS
};
