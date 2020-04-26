import { markup } from '../../../routes/index.js';
import { addCssClass, getElementPath, hasCssClass } from '../../../modules/html/html';
import { touchType } from '../../../modules/device/device-client';
import { connect, create } from '../../../modules/reactive/Reactive';
import windowStyle from '../../components/frame/style.css';
import { findIndex } from '../../../modules/array/array';
import {
    createBreadcrumb,
    createHtmlElement,
    getRouteFromHref
} from '../../../modules/templating/client';
import { loadBundle } from '../../../modules/bundle';
import { Thread } from '../../../modules/thread/Thread';

const { ROUTES_PATH } = require('../../../constants');

export default async function () {
    const { locale, thread } = this;
    const homeRoute = `${ROUTES_PATH}index`;
    const routerStore = create({
        frames: []
    });
    const router = {};
    const appElement = document.getElementById('app');

    const { element: home } = createHtmlElement({ markup: markup() }, this);
    addCssClass(document.body, touchType);

    appElement.appendChild(home);

    const showFrame = route => {
        const { element: frame, destroy: destroyFrame } = createHtmlElement({ markup: '<iwindow></iwindow>' }, this);
        frame.iSetValue(locale.get(`${route}/title`));
        const item = { frame, route };
        routerStore.frames.push(item);
        frame.iOn('close', () => {
            const [{ destroy }] = routerStore.frames.splice(routerStore.frames.get().indexOf(item), 1);
            destroy();
        });
        home.querySelector('.frames').appendChild(frame);
        loadBundle(route, frame, this).then(async ({ markup, bootstrap }) => {
            const frameThread = Thread(thread.getStatements(), this);
            const { element: page, destroy: destroyPage } = createHtmlElement({ markup }, this);
            frame.iSetContent(page);
            frameThread.extend({ frame, page, home, locale });
            const destroyBundle = await frameThread.main(bootstrap).subscribe();
            frameThread.main('init/notifications');
            item.destroy = () => {
                destroyPage();
                destroyFrame();
                destroyBundle();
            };
        });
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

    let actualRoute = getRouteFromHref(locale);
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
