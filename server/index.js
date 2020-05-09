require('../modules/functional-programming/FunctionalProgramming').FunctionalProgramming(Function);
const { Thread } = require('../modules/thread/Thread');
const requireContext = require('require-context');
const { parseStatements } = require('../modules/thread/thread-utils');
const context = requireContext(`${__dirname}/statements`, true, /\.js/);
const mainThread = Thread(parseStatements(context, '.js'));

(async function () {
    mainThread.main('init/process').subscribe(mainThread.extend);
    mainThread.main('init/app').subscribe(mainThread.extend);
    mainThread.main('init/server').subscribe(mainThread.extend);
    mainThread.main('init/webpack');
    await mainThread.main('init/db').subscribe().then(mainThread.extend);
    await mainThread.main('init/web-socket').subscribe().then(mainThread.extend);
    mainThread.main('init/session').subscribe(mainThread.extend);
    mainThread.main('init/locale').subscribe();
    await mainThread.main('init/form-routes').subscribe().then(mainThread.extend);
    mainThread.main('api/account').subscribe();
    mainThread.main('api/rest').subscribe();
    mainThread.main('init/router').subscribe();
    await mainThread.main(async function () {
        await this.server.listen();
    }).subscribe();
})();
