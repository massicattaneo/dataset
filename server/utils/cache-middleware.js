const cache = ({ process }) => {
    return (request, response, next) => {
        if (!process.isDevelopment) {
            response.set('Cache-Control', 'public, max-age=31536000');
        }
        next();
    };
};

module.exports = {
    cache
};
