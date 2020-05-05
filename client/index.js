import './index.css';
import { parseStatements } from '../modules/thread/thread-utils';
import { Thread } from '../modules/thread/Thread';
import { FunctionalProgramming } from '../modules/functional-programming/FunctionalProgramming';
import { logThreadMiddleware } from './middlewares';

// TODO: for IE11 add:
// missing support for css variables
// import '@babel/polyfill';
// import ResizeObserver from 'resize-observer-polyfill';
// import 'custom-event-polyfill';
// if (!window.ResizeObserver) {
//     window.ResizeObserver = ResizeObserver;
// }
// if (!Element.prototype.matches) {
//     Element.prototype.matches = Element.prototype.msMatchesSelector;
// }

FunctionalProgramming(Function);

const statements = parseStatements(require.context('./statements/', true, /.js/), '.js');
const thread = Thread(statements);

(async function () {
    thread.before(logThreadMiddleware);
    await thread.main('init/notifications').subscribe();
    await thread.main('init/keyboard').subscribe().then(thread.extend);
    await thread.main('init/store').subscribe().then(thread.extend);
    await thread.main('init/locale').subscribe().then(thread.extend);
    await thread.main('init/web-socket').subscribe().then(thread.extend);
    await thread.main('init/resources').subscribe().then(thread.extend);
    await thread.main('init/sounds').subscribe().then(thread.extend);
    await thread.main('init/router').subscribe().then(thread.extend);
    thread.main('init/header-services');
})();
