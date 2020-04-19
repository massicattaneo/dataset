import { addCssClass, getElementPath, hasCssClass } from '../../../modules/html/html';
import { touchType } from '../../../modules/device/device-client';
import { connect, create } from '../../../modules/reactive/Reactive';
import windowStyle from '../../components/frame/style.css';
import { findIndex } from '../../../modules/array/array';
import { createHtmlElement, createRouteFrame, getRouteTemplate } from '../../../modules/templating/client';

const createFrame = (route, { thread, locale }, { frames }) => {
    const frame = createRouteFrame({ route, locale });
    const item = { frame, route };
    frames.push(item);
    frame.iOn('close', () => frames.splice(frames.get().indexOf(item), 1));
    return frame;
};

export default async function () {
    const { locale } = this;
    const routerStore = create({
        frames: [],
        route: ''
    });
    const router = {};
    const homeRoute = 'routes/index';
    const { href } = locale.get(homeRoute);
    const appElement = document.getElementById('app');
    const home = createHtmlElement({ markup: getRouteTemplate('index'), locale });
    addCssClass(document.body, touchType);

    appElement.appendChild(home);
    window.addEventListener('click', async event => {
        if (!event.custom || !event.custom.route) return;
        const frame = createFrame(event.custom.route, this, routerStore);
        home.querySelector('.frames').appendChild(frame);
        frame.iPosition({ width: 500 });
    });

    // CLICK ON WINDOW
    window.addEventListener('mousedown', async event => {
        const clickedFrame = getElementPath(event.target).find(el => hasCssClass(el, windowStyle.local));
        console.warn(clickedFrame);
        if (!clickedFrame) return;
        const index = findIndex(routerStore.frames.get(), el => el.frame === clickedFrame);
        routerStore.frames.push(routerStore.frames.get().splice(index, 1)[0]);
    });

    window.history.replaceState({ route: homeRoute }, '', href);
    window.addEventListener('popstate', event => {
        if (event.state.route) {
            const { frame, route } = routerStore.frames.last();
            frame.iClose();
        }
    });

    connect(routerStore, ({ frames }) => {
        const { route } = frames.last() || { route: homeRoute };
        frames.get().filter(el => el).forEach((el, index) => el.frame.style.zIndex = index);
        if (routerStore.route.is(route)) return;
        routerStore.route.set(route);
        const { href } = locale.get(route);
        window.history.pushState({ route }, '', href);
    });

    return { router, home };
}
