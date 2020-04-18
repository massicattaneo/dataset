import { addCssClass } from '../../../modules/html/html';
import { touchType } from '../../../modules/device/device-client';
import { getRouteTemplate } from '../../utils';
import { connect } from '../../../modules/reactive/Reactive';
import { ROUTES_PATH } from '../../../constants';

export default async function () {
    const { thread, locale, store } = this;
    const router = {};
    const homeRoute = 'routes/index';
    const { href } = locale.get(homeRoute);
    const appElement = document.getElementById('app');
    const home = await thread.main('create/htmlElement', { markup: getRouteTemplate('index') }).subscribe();
    addCssClass(document.body, touchType);

    thread
        .before
        .filterStack(route => route.startsWith(ROUTES_PATH) && route !== `${ROUTES_PATH}index`)
        .subscribe(async function (...args) {
            const next = args.pop();
            const [route, params] = args;
            const window = await this.thread.main('create/window', { route }).subscribe();
            return next(route, { window });
        });

    appElement.appendChild(home);
    window.addEventListener('click', event => {
        if (event.custom && event.custom.route) {
            const { href } = locale.get(event.custom.route);
            window.history.pushState(event.custom, '', href);
            console.warn('USER NAV');
            thread.main(event.custom.route);
        }
    });

    window.history.replaceState({ route: homeRoute }, '', href);
    window.addEventListener('popstate', event => {
        if (event.state.route) {
            console.warn('BROWSER NAV');
            thread.main(event.state.route);
        }
    });

    connect({ frames: store.frames }, ({ frames }) => {
        const array = frames.get();
        const { route } = array[array.length - 1] || { route: homeRoute };
    });

    return { router, home };
}
