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

module.exports = {
    cache,
    requiresLogin
};
