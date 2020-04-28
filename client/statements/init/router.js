import { markup } from '../../../routes/index.js';
import { addCssClass, getElementPath, hasCssClass } from '../../../modules/html/html';
import { isMobile, touchType } from '../../../modules/device/device-client';
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

function setFrameAsActive(routerStore, clickedFrame) {
    const index = findIndex(routerStore.frames.get(), el => el.frame === clickedFrame);
    routerStore.frames.push(routerStore.frames.get().splice(index, 1)[0]);
}

export default async function () {
    const { locale, thread, loader } = this;
    const homeRoute = `${ROUTES_PATH}index`;
    const routerStore = create({
        frames: []
    });
    const router = {};
    const appElement = document.getElementById('app');
    const { element: home } = createHtmlElement({ markup: markup() }, this);
    addCssClass(document.body, touchType);

    document.getElementById('start-logo').style.display = 'none';
    appElement.appendChild(home);

    const showFrame = route => {
        const { element: frame, destroy: destroyFrame } = createHtmlElement({ markup: '<iwindow></iwindow>' }, this);
        frame.iSetValue(locale.get(`${route}/title`));
        const item = { frame, route };
        routerStore.frames.push(item);
        frame.iOn('close', () => {
            const [{ destroy = (e => e) }] = routerStore.frames.splice(routerStore.frames.get().indexOf(item), 1);
            destroy();
        });
        home.querySelector('.frames').appendChild(frame);
        loader.start();
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
            loader.stop();
        });
    };

    window.addEventListener('click', async event => {
        if (!event.custom || !event.custom.route) return;
        if (event.custom.route === homeRoute) return;
        const { route } = routerStore.frames.last() || {};
        if (route && route === event.custom.route) {
            return history.back();
        }
        if (route && routerStore.frames.get().find(item => item.route === event.custom.route)) {
            const { frame: clickedFrame } = routerStore.frames.get().find(item => item.route === event.custom.route);
            return setFrameAsActive(routerStore, clickedFrame);
        }
        if (isMobile && route) {
            history.back();
        }
        setTimeout(() => showFrame(event.custom.route), 50);
    });

    // CLICK ON WINDOW
    window.addEventListener('mousedown', async event => {
        const clickedFrame = getElementPath(event.target).find(el => hasCssClass(el, windowStyle.local));
        if (!clickedFrame) return;
        setFrameAsActive(routerStore, clickedFrame);
    });

    let actualRoute = getRouteFromHref(locale);
    const { href, title } = locale.get(actualRoute);
    window.history.replaceState({ route: actualRoute }, title, href);
    document.title = title;
    if (actualRoute !== homeRoute) showFrame(actualRoute);

    window.addEventListener('popstate', event => {
        if (event.state.route && routerStore.frames.last()) {
            const { frame, route } = routerStore.frames.last();
            frame.iClose();
        } else {
            showFrame(event.state.route);
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
