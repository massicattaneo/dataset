import './index.css';
import { parseStatements } from '../modules/thread/thread-utils';
import { Thread } from '../modules/thread/Thread';
import { FunctionalProgramming } from '../modules/functional-programming/FunctionalProgramming';
import { ROUTES_PATH } from '../constants';

FunctionalProgramming(Function);

const routesStatements = parseStatements(require.context('../routes/', true, /.js/), '.js', { prefixPath: ROUTES_PATH });
const statements = parseStatements(require.context('./statements/', true, /.js/), '.js');
const thread = Thread({ ...statements, ...routesStatements });

(async function () {
    thread.before(async function (...args) {
        const next = args.pop();
        const [route, params] = args;
        if (route.startsWith(ROUTES_PATH) && route !== `${ROUTES_PATH}index`) {
            const window = await this.thread.main('create/window', { route }).subscribe();
            return next(route, { window });
        }
        next(...args);
    });

    await thread.main('init/errors').subscribe();
    await thread.main('init/store').subscribe().then(thread.extend);
    await thread.main('init/locale').subscribe().then(thread.extend);
    await thread.main('init/resources').subscribe().then(thread.extend);
    await thread.main('init/router').subscribe().then(thread.extend);
    thread.main('api/login-status');
})();
