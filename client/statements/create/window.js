import { getRouteTemplate } from '../../utils';
import { getComputed } from '../../../modules/html/html';
import { STYLE } from '../../../constants';
import { isDesktop } from '../../../modules/device/device-client';

function positionWindow(win, options) {
    if (isDesktop) {
        const { width, height } = options;
        const availableHeight = window.innerHeight - STYLE.HOME_FOOTER_HEIGHT - STYLE.HOME_HEADER_HEIGHT;
        const availableWidth = window.innerWidth;
        win.style.width = width ? `${Math.min(width, availableWidth)}px` : '';
        win.style.height = height ? `${Math.min(height, availableHeight)}px` : '';
        const winWidth = getComputed(win, 'width');
        const winHeight = getComputed(win, 'height');
        const lft = (availableWidth - winWidth) / 2 + STYLE.HOME_HEADER_HEIGHT;
        const tp = (availableHeight - winHeight) / 2;
        win.style.left = `${lft}px`;
        win.style.top = `${tp}px`;
    }
}

export default async function ({ route }) {
    const { home, store } = this;
    const page = await this.thread.main('create/htmlElement', { markup: getRouteTemplate(route) }).subscribe();
    const frame = await this.thread.main('create/htmlElement', { markup: '<i-window></i-window>' }).subscribe();
    const item = { frame, route };
    store.frames.push(item);
    frame.setContent(page);
    home.querySelector('.frames').appendChild(frame);
    positionWindow(frame, { width: 500 });
    frame.iOn('close', () => store.frames.splice(store.frames.get().indexOf(item), 1));
    return frame;
}
