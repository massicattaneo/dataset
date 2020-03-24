import { Node } from '../../utils/html';

export default async function () {
    const body = document.body;
    body.appendChild(Node(`<i-status-bar></i-status-bar>`));
    body.appendChild(Node(`<i-notification type="success"></i-notification>`));
}
