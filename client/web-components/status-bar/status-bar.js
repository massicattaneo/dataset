import './status-bar.css';

const template = document.createElement('template');
template.innerHTML = ``;

class Loader extends HTMLElement {

    constructor() {
        super();
        this.appendChild(template.content.cloneNode(true));
    }
}

window.customElements.define('i-status-bar', Loader);


