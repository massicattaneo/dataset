import { addCssClass } from '../../../modules/html/html';
import { touchType } from '../../../modules/device/device-client';
import { getRouteTemplate } from '../../utils';

export default async function () {
    const { thread } = this;
    const router = {};
    const appElement = document.getElementById('app');
    const home = await thread.main('create/htmlElement', { markup: getRouteTemplate('index') }).subscribe();
    addCssClass(document.body, touchType);

    appElement.appendChild(home);
    window.addEventListener('click', event => {
        if (event.custom) {
            window.history.pushState(event.custom, '', event.custom.href);
            thread.main(event.custom.path);
        }
    });
    const href = `/${this.store.language.get()}/`;
    window.history.replaceState({ path: 'routes/index', href }, '', href);
    window.addEventListener('popstate', event => {
        if (event.state.path) {
            thread.main(event.state.path);
        }
    });
    return { router, home };
}
