const { HTTP_STATUSES } = require('../../constants');

const cache = ({ process }) => {
    return (request, response, next) => {
        if (!process.isDevelopment) {
            response.set('Cache-Control', 'public, max-age=31536000');
        }
        next();
    };
};

const requiresLogin = (externalValidation = () => false) => (request, response, next) => {
    if (externalValidation(request)) return next();
    if (request.session && request.session.userId) return next();
    request.session.destroy(() => response.status(HTTP_STATUSES.UNAUTHORIZED).json({ message: 'Unauthorized' }));
};

const hasWebSocketSignature = ({ webSocket }) => (request, response, next) => {
    const { headers } = request;
    const connectionId = webSocket.getConnectionId(headers.signature);
    const errors = { path: 'notifications/error/critical-error' };
    if (!connectionId) return response.status(HTTP_STATUSES.INVALID_VALIDATION).send(errors);
    next();
}

module.exports = {
    cache,
    requiresLogin,
    hasWebSocketSignature
};
