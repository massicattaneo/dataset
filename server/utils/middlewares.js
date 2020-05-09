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
    request.session.destroy(err => response.status(401).json({ message: 'Unauthorized' }));
};

module.exports = {
    cache,
    requiresLogin
};
