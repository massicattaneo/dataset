import './icon.css';

const template = document.createElement('template');
template.innerHTML = `<span>TITLE</span><strong></strong>`;

class Icon extends HTMLElement {

    constructor() {
        super();
        this.appendChild(template.content.cloneNode(true));
        this.querySelector('span').innerHTML = this.getAttribute('title').toLowerCase();
    }
}

window.customElements.define('i-icon', Icon);


