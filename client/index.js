import './index.css';
import { parseStatements } from '../core/core-utils';
import { Thread } from '../core/Thread';
import { FunctionalProgramming } from '../core/FunctionalProgramming';

FunctionalProgramming(Function);

parseStatements(require.context('./web-components/', true, /.js/));

const statements = parseStatements(require.context('./statements/', true, /.js/), '.js');
const thread = Thread(statements);

(async function () {
    await thread.main('init/resources').subscribe().then(thread.extend);
    await thread.main('init/home-page').subscribe().then(thread.extend);
})();
