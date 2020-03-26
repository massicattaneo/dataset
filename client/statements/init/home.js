import { Node } from '../../../modules/html/html';

export default async function () {
    const body = document.body;
    const statusBar = Node(`<i-status-bar></i-status-bar>`);
    const notification = Node(`<i-notification></i-notification>`);
    const home = { notification, statusBar };
    body.appendChild(statusBar);
    body.appendChild(notification);
    return { home };
}
