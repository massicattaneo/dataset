import { addCssClass, getElementPath, hasCssClass } from '../../../modules/html/html';
import { touchType } from '../../../modules/device/device-client';
import { connect, create } from '../../../modules/reactive/Reactive';
import windowStyle from '../../components/frame/style.css';
import { findIndex } from '../../../modules/array/array';
import {
    createBreadcrumb,
    createHtmlElement,
    createRouteFrame,
    getRouteTemplate
} from '../../../modules/templating/client';

const { ROUTES_PATH } = require('../../../constants');

const createFrame = (route, { thread, locale }, { frames }) => {
    const frame = createRouteFrame({ route, locale });
    const item = { frame, route };
    frames.push(item);
    frame.iOn('close', () => {
        frames.splice(frames.get().indexOf(item), 1);
    });
    return frame;
};

const getActualRoute = locale => {
    const route = locale.route(location.pathname);
    if (!route) return 'routes/error/404';
    return route;
};

export default async function () {
    const { locale } = this;
    const homeRoute = `${ROUTES_PATH}index`;
    const routerStore = create({
        frames: []
    });
    const router = {};
    const appElement = document.getElementById('app');
    const home = createHtmlElement({ markup: getRouteTemplate('index'), locale });
    addCssClass(document.body, touchType);

    appElement.appendChild(home);

    const showFrame = route => {
        const frame = createFrame(route, this, routerStore);
        home.querySelector('.frames').appendChild(frame);
        frame.iPosition({ width: 500 });
    };

    window.addEventListener('click', async event => {
        if (!event.custom || !event.custom.route) return;
        if (event.custom.route === homeRoute) return;
        showFrame(event.custom.route);
    });

    // CLICK ON WINDOW
    window.addEventListener('mousedown', async event => {
        const clickedFrame = getElementPath(event.target).find(el => hasCssClass(el, windowStyle.local));
        if (!clickedFrame) return;
        const index = findIndex(routerStore.frames.get(), el => el.frame === clickedFrame);
        routerStore.frames.push(routerStore.frames.get().splice(index, 1)[0]);
    });

    let actualRoute = getActualRoute(locale);
    const { href, title } = locale.get(homeRoute);
    window.history.replaceState({ route: homeRoute }, title, href);
    document.title = title;
    if (actualRoute !== homeRoute) showFrame(actualRoute);
    actualRoute = '';

    window.addEventListener('popstate', event => {
        if (event.state.route) {
            const { frame, route } = routerStore.frames.last();
            frame.iClose();
        }
    });

    connect(({ frames: routerStore.frames }), ({ frames }) => {
        const { route } = frames.last() || { route: homeRoute };
        frames.get().filter(el => el).forEach((el, index) => el.frame.style.zIndex = index);
        if (actualRoute === route) return;
        actualRoute = route;
        const { href, title } = locale.get(route);
        window.history.pushState({ route }, title, href);
        document.title = title;
        home.breadcrumb.iSetHtml(createBreadcrumb(href, route, locale));
    });

    return { router, home };
}
