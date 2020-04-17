import { Node } from '../../../modules/html/html';
import { getRouteTemplate } from '../../utils';

export default async function ({ path }) {
    const markup = '<i-window></i-window>';
    const page = await this.thread.main('create/htmlElement', { markup: getRouteTemplate(path) }).subscribe();
    const w = await this.thread.main('create/htmlElement', { markup }).subscribe();
    w.setContent(page);
    document.body.appendChild(w);
}
