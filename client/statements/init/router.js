import { addCssClass } from '../../../modules/html/html';
import { touchType } from '../../../modules/device/device-client';
import { getRouteTemplate } from '../../utils';
import { connect } from '../../../modules/reactive/Reactive';

export default async function () {
    const { thread, locale, store } = this;
    const router = {};
    const homeRoute = 'routes/index';
    const { href} = locale.get(homeRoute);
    const appElement = document.getElementById('app');
    const home = await thread.main('create/htmlElement', { markup: getRouteTemplate('index') }).subscribe();
    addCssClass(document.body, touchType);

    appElement.appendChild(home);
    window.addEventListener('click', event => {
        if (event.custom && event.custom.route) {
            const { href} = locale.get(event.custom.route);
            window.history.pushState(event.custom, '', href);
            thread.main(event.custom.route);
        }
    });

    window.history.replaceState({ route: homeRoute }, '', href);
    window.addEventListener('popstate', event => {
        if (event.state.route) {
            thread.main(event.state.route);
        }
    });

    connect({ frames: store.frames }, ({ frames }) => {
        const array = frames.get();
        const last = array[array.length - 1] || { route: homeRoute };
        console.warn(last);
    });

    return { router, home };
}
