const { Middleware } = require('../middleware/Middleware');

/** Thread */
let pointer = 1;

function getFunction(statements, statement) {
    if (statement instanceof Function) {
        return statement;
    }
    return statements[statement];
}

function Thread(statements = {}, sharedContext = {}, { name = pointer++, clean = [] } = {}) {
    const thread = {};
    const middleware = Middleware();
    const onErrors = [];
    const context = {
        sharedContext,
        thread,
        threadName: `THREAD ${name}`
    };

    thread.before = middleware.before();
    thread.main = middleware.use(
        (statement, ...params) => {
            const returnValue = params.pop()(getFunction(statements, statement).call(context, ...params));
            if (returnValue.catch) {
                returnValue.catch(function (e) {
                    onErrors.forEach(cb => cb(e));
                });
            }
            return returnValue;
        },
        context
    );
    thread.extend = (...args) => Object.assign(context, ...args);
    thread.exit = err => {
        if (err && process) process.exit();
        if (err) throw new Error(err);
        return false;
    };
    thread.getStatements = () => statements;
    thread.cleanContext = () => {
        const ctx = { ...context };
        delete ctx.sharedContext;
        delete ctx.thread;
        delete ctx.threadName;
        clean.forEach(item => delete ctx[item]);
        return ctx;
    };
    thread.onError = function (callback) {
        onErrors.push(callback);
        return () => {
            onErrors.splice(onErrors.indexOf(callback), 1);
        };
    };

    return thread;
}

module.exports = { Thread };
