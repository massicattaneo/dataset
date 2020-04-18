import { addCssClass } from '../../../modules/html/html';
import { touchType } from '../../../modules/device/device-client';
import { getRouteTemplate } from '../../utils';
import { connect } from '../../../modules/reactive/Reactive';
import { ROUTES_PATH } from '../../../constants';

export default async function () {
    const { thread, locale, store } = this;
    const router = {};
    const homePath = 'index';
    const href = locale.href(`${ROUTES_PATH}${homePath}`);
    const appElement = document.getElementById('app');
    const home = await thread.main('create/htmlElement', { markup: getRouteTemplate('index') }).subscribe();
    addCssClass(document.body, touchType);

    appElement.appendChild(home);
    window.addEventListener('click', event => {
        if (event.custom && event.custom.path) {
            const href = locale.href(event.custom.path);
            window.history.pushState(event.custom, '', href);
            thread.main(event.custom.path);
        }
    });

    window.history.replaceState({ path: homePath }, '', href);
    window.addEventListener('popstate', event => {
        if (event.state.path) {
            thread.main(event.state.path);
        }
    });

    connect({ frames: store.frames }, ({ frames }) => {
        const array = frames.get();
        const last = array[array.length - 1] || { path: homePath };
        console.warn(last);
    });

    return { router, home };
}
