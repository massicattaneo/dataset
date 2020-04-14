import { parseStatements } from '../../../core/core-utils';
import { addCssClass } from '../../../modules/html/html';
import { touchType } from '../../../modules/device/device-client';

const htmlPages = parseStatements(require.context('../../../pages/', true, /.html/));
parseStatements(require.context('../../../pages/', true, /.css/));

export default async function () {
    const { thread } = this;
    const router = {};
    const appElement = document.getElementById('app');
    const home = await thread.main('page/create', { markup: htmlPages['index.html'] }).subscribe();
    addCssClass(document.body, touchType);

    appElement.appendChild(home);
    // window.history.replaceState({}, '', `/${this.store.language.get()}/`);
    return { router, home };
}
