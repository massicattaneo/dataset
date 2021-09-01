import { markup } from '../../../routes/index';
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
import { updateMenuItems } from '../../middlewares/account';

const { ROUTES_PATH } = require('../../../constants');

const setFrameAsActive = (routerStore, clickedFrame) => {
    const index = findIndex(routerStore.frames.get(), el => el.frame === clickedFrame);
    routerStore.frames.push(routerStore.frames.get().splice(index, 1)[0]);
}

export default async function () {
    const { locale, thread, loader, store } = this;
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
        if (isMobile && routerStore.frames.get().length) {
            routerStore.frames.get()[0].frame.iClose();
        }
        const { element: frame, destroy: destroyFrame } = createHtmlElement({ markup: '<iwindow></iwindow>' }, this);
        frame.iSetValue(locale.get(`${route}/title`));
        const item = { frame, route };
        routerStore.frames.push(item);
        frame.iOn('close', ({ popState = false } = {}) => {
            const [{ destroy = (e => e) }] = routerStore.frames.splice(routerStore.frames.get().indexOf(item), 1);
            destroy();
        });
        home.querySelector('.frames').appendChild(frame);
        loader.start();
        loadBundle(route, frame, this).then(async ({ markup, bootstrap }) => {
            const frameThread = Thread(thread.getStatements(), this);
            console.log(markup);
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
        if (event.custom.route === homeRoute) {
            if (isMobile && routerStore.frames.get().length) {
                routerStore.frames.get()[0].frame.iClose();
            }
            return;
        }
        const { route } = routerStore.frames.last() || {};
        if (route && routerStore.frames.get().find(item => item.route === event.custom.route)) {
            const { frame: clickedFrame } = routerStore.frames.get().find(item => item.route === event.custom.route);
            return setFrameAsActive(routerStore, clickedFrame);
        }
        setTimeout(() => showFrame(event.custom.route), 50);
    });

    // CLICK ON WINDOW
    window.addEventListener('mousedown', async event => {
        const clickedFrame = getElementPath(event.target).find(el => hasCssClass(el, windowStyle.local));
        if (!clickedFrame) return;
        setFrameAsActive(routerStore, clickedFrame);
    });

    window.addEventListener('popstate', async event => {
        const { route } = event.state;
        const find = routerStore.frames.get().find(item => item.route === route);
        if (route === homeRoute) {
            routerStore.frames.get().forEach(item => {
                item.frame.iClose();
            });
        } else if (find) {
            setFrameAsActive(routerStore, find.frame);
        } else {
            showFrame(route)
        }
    });

    let actualRoute = getRouteFromHref(locale);
    const { href, title } = locale.get(actualRoute);
    window.history.replaceState({ route: actualRoute }, title, href);
    document.title = title;
    if (actualRoute !== homeRoute) showFrame(actualRoute);

    connect(({ frames: routerStore.frames }), ({ frames }) => {
        const { route } = frames.last() || { route: homeRoute };
        frames.get().filter(el => el).forEach((el, index) => el.frame.style.zIndex = index);
        if (actualRoute === route) return;
        actualRoute = route;
        const { href, title } = locale.get(route);
        document.title = title;
        home.breadcrumb.iSetHtml(createBreadcrumb(href, route, locale));
        if (window.history.state.route !== actualRoute) {
            window.history.pushState({ route: actualRoute }, title, href);            
        }
    });

    updateMenuItems(store, home);

    router.redirect = route => {
        if (route === homeRoute) {
            routerStore.frames.get().forEach(item => {
                item.frame.iClose();
            });
            const { href, title } = locale.get(route);
            window.history.pushState({ route: actualRoute }, title, href);
        } else if (route !== homeRoute) {
            showFrame(route)
        }
    }

    return { router, home };
}
