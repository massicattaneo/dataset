import { getRouteTemplate } from '../../utils';
import { getComputed } from '../../../modules/html/html';
import { STYLE } from '../../../core/constants';

function positionWindow(win, options) {
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

export default async function ({ path }) {
    const { home } = this;
    const page = await this.thread.main('create/htmlElement', { markup: getRouteTemplate(path) }).subscribe();
    const win = await this.thread.main('create/htmlElement', { markup: '<i-window></i-window>' }).subscribe();
    win.setContent(page);
    home.querySelector('.windows').appendChild(win);
    positionWindow(win, { width: 500 });
    return win;
}
