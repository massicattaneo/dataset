export const logThreadMiddleware = function (...args) {
    const next = args.pop();
    const [route] = args;
    console.warn('THREAD:', route);
    return next(...args);
};
