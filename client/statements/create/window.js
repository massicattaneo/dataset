import { getRouteTemplate } from '../../utils';

export default async function ({ path }) {
    const { home } = this;
    const page = await this.thread.main('create/htmlElement', { markup: getRouteTemplate(path) }).subscribe();
    const window = await this.thread.main('create/htmlElement', { markup: '<i-window></i-window>' }).subscribe();
    window.setContent(page);
    home.querySelector('.windows').appendChild(window);
    return window;
}
