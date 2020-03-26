import './notification.css';
import { addCssClass, removeCssClass } from '../../../modules/html/html';

const template = document.createElement('template');
template.innerHTML = `<div><span></span><em></em></div>`;

const ICONS = {
    info: 'icofont-info-circle',
    warn: 'icofont-warning-alt',
    success: 'icofont-verification-check',
    error: 'icofont-error'
};

const types = ['info', 'warn', 'success', 'error'];

class Loader extends HTMLElement {

    constructor() {
        super();
        this.appendChild(template.content.cloneNode(true));
    }

    show(type, text, timeout = 0) {
        removeCssClass(this, ...types);
        removeCssClass(this.children[0].children[0], ...(types.map(type => ICONS[type])));
        addCssClass(this, type);
        addCssClass(this.children[0].children[0], ICONS[type]);
        const textEl = this.children[0].children[1];
        textEl.innerHTML = text;
        setTimeout(() => addCssClass(this, 'show'));
        if (timeout) {
            setTimeout(() => this.hide(), timeout);
        }
    }

    hide() {
        removeCssClass(this, 'show');
    }
}

window.customElements.define('i-notification', Loader);


