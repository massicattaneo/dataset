import './index.scss';
import { parseStatements } from '../core/core-utils';
import { Thread } from '../modules/thread/Thread';
import { FunctionalProgramming } from '../modules/functional-programming/FunctionalProgramming';
import { WIZARD } from './components/wizard/script';

FunctionalProgramming(Function);

const statements = parseStatements(require.context('./statements/', true, /.js/), '.js');
const thread = Thread(statements);

(async function () {
    await thread.main('init/errors').subscribe();
    await thread.main('init/store').subscribe().then(thread.extend);
    await thread.main('init/locale').subscribe().then(thread.extend);
    await thread.main('init/resources').subscribe().then(thread.extend);
    await thread.main('init/router').subscribe().then(thread.extend);
    thread.main('api/login-status');
})();
