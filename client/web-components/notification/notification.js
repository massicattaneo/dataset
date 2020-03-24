import './notification.css';
import { addCssClass } from '../../utils/html';

const template = document.createElement('template');
template.innerHTML = `<div><span></span><em></em></div>`;

const ICONS = {
    info: 'icofont-info-circle',
    warn: 'icofont-warning-alt',
    success: 'icofont-verification-check',
    error: 'icofont-error'
};

class Loader extends HTMLElement {

    constructor() {
        super();
        this.appendChild(template.content.cloneNode(true));
        const type = this.getAttribute('type');
        addCssClass(this, type);
        addCssClass(this.children[0].children[0], ICONS[type]);
        this._text = this.children[0].children[1];
    }

    show(text) {
        this._text.innerHTML = text;
    }
}

window.customElements.define('i-notification', Loader);


