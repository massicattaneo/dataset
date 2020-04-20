import './index.css';
import { parseStatements } from '../modules/thread/thread-utils';
import { Thread } from '../modules/thread/Thread';
import { FunctionalProgramming } from '../modules/functional-programming/FunctionalProgramming';
import { ROUTES_PATH } from '../constants';
import { logThreadMiddleware } from './middlewares';

FunctionalProgramming(Function);

const routesStatements = parseStatements(require.context('../routes/', true, /.js/), '.js', { prefixPath: ROUTES_PATH });
const statements = parseStatements(require.context('./statements/', true, /.js/), '.js');
const thread = Thread({ ...statements, ...routesStatements });

(async function () {
    thread.before(logThreadMiddleware);
    await thread.main('init/errors').subscribe();
    await thread.main('init/store').subscribe().then(thread.extend);
    await thread.main('init/locale').subscribe().then(thread.extend);
    await thread.main('init/resources').subscribe().then(thread.extend);
    await thread.main('init/router').subscribe().then(thread.extend);
    thread.main('init/header-services');
    thread.main('api/login-status');
})();
