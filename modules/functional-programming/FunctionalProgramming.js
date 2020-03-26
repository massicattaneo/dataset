function FunctionalProgramming(FnObj = {}) {
    const proto = FnObj.prototype || FnObj;

    function getSelf(context, args1) {
        return FnObj.prototype ? context : args1.shift();
    }

    proto.partial = function (...args1) {
        const self = getSelf(this, args1);
        return function (...args2) {
            return self(...args1, ...args2);
        };
    };

    proto.argumentsOrder = function (...args1) {
        const self = getSelf(this, args1);
        return function (...args2) {
            const params = args1.map(i => args2[i]);
            return self(...params);
        };
    };

    proto.filter = function (...args1) {
        const self = getSelf(this, args1);
        const filter = args1.shift();
        const not = args1.pop() || (e => e);
        let counter = 0;
        return function (callback) {
            return self(function (...args) {
                if (filter.call(this, ...args, counter++))
                    return callback.call(this, ...args);
                return not(...args);
            });
        };
    };

    proto.map = function (...args1) {
        const self = getSelf(this, args1);
        const map = args1.shift();
        let counter = 0;
        return function (callback) {
            return self(function (...args) {
                return callback.call(this, map.call(this, ...args, counter++));
            });
        };
    };

    proto.spread = function (...args1) {
        const self = getSelf(this, args1);
        return function (callback) {
            return self(function (args) {
                return callback(...args);
            });
        };
    };

    proto.destructure = function (...args1) {
        const self = getSelf(this, args1);
        return function (callback) {
            return self(function (o) {
                return callback(...args1.map(key => o[key]));
            });
        };
    };

    proto.debounce = function (...args1) {
        const self = getSelf(this, args1);
        const time = args1.shift();
        return function (callback) {
            let start = Date.now();
            let first = true;
            let to;
            return self(function (...args) {
                if (first) {
                    first = false;
                    start = Date.now();
                    return callback.call(this, ...args);
                } else {
                    if ((Date.now() - start) < time) {
                        clearTimeout(to);
                        to = setTimeout(() => callback.call(this, ...args), (Date.now() - start));
                    } else {
                        first = true;
                    }
                }
            });
        };
    };

    proto.debouncePromise = function (...args1) {
        const self = getSelf(this, args1);
        return function (callback) {
            let can = true;

            function toRemove(...args2) {
                if (can) {
                    can = false;
                    return callback(...args2).then(function (a) {
                        can = true;
                        return a;
                    }).catch(function () {
                        can = true;
                    });
                }
            }

            self(toRemove);
            return toRemove;
        };
    };

    proto.queue = function (...args1) {
        const self = getSelf(this, args1);
        const queue = [];
        let isRunning = false;

        function run() {
            if (queue[0]) {
                queue.shift()().then(run);
                isRunning = true;
            } else if (isRunning) {
                isRunning = false;
            }
        }

        return function (callback) {
            return self(function (...args) {
                queue.push(() => callback(...args));
                !isRunning && run();
            });
        };
    };

    proto.compose = function (...args1) {
        const self = getSelf(this, args1);
        const fn = args1.shift();
        return function (...args) {
            return fn(self(...args));
        };
    };

    proto.prepose = function (...args1) {
        const self = getSelf(this, args1);
        const fn = args1.shift();
        return function (...args) {
            return self(fn(...args));
        };
    };

    proto.subscribe = function (...args1) {
        const self = getSelf(this, args1);
        const callback = args1.shift() || (e => e);
        return self(callback);
    };

    proto.memoize = function (...args1) {
        const self = getSelf(this, args1);
        const transform = args1.shift() || (e => e.toString());
        const memory = [];
        return function (...args) {
            const memo = memory[transform(...args)];
            if (memo) return memo;
            const res = self(...args);
            memory[transform(...args)] = res;
            return res;
        };
    };

    /**
     *
     * @param maxRetry
     * @param retryTimeout
     * @returns {function(...[*]=): Promise<unknown>}
     */
    proto.retry = function (...args1) {
        const self = getSelf(this, args1);
        const maxRetry = args1[0] || 5;
        const retryTimeout = args1[1] || 1000;
        return function (...args) {
            return new Promise((resolve, reject) => {
                const recursivelyRetryLoading = (counter, ...args2) => {
                    self(...args2)
                        .then(resolve)
                        .catch(error => {
                            if (counter < maxRetry) {
                                setTimeout(() => recursivelyRetryLoading(++counter, ...args), retryTimeout);
                            } else {
                                reject(error);
                            }
                        });
                };
                recursivelyRetryLoading(1, ...args);
            });
        };
    };


    FnObj.wrap = function (value) {
        return function (callback) {
            return callback(value);
        };
    };

    FnObj.identity = function () {
        return function (value) {
            return value;
        };
    };

    return proto;

}

module.exports = { FunctionalProgramming };
