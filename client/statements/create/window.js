import { Node } from '../../../modules/html/html';

export default async function ({ path }) {
    const markup = '<i-window></i-window>';
    const page = await this.thread.main('create/page', { path }).subscribe();
    const w = await this.thread.main('create/page', { markup }).subscribe();
    w.setContent(page);
    document.body.appendChild(w);
}
