import './style.scss';
import { Node } from '../../../modules/html/html';

const WIZARD = {
    TYPES: {
        CONFIRM: 'confirm',
        NUMBER: 'number',
        TEXT: 'text',
        DATE: 'date',
        PASSWORD: 'password',
        TEXT_AREA: 'textarea',
        SELECT: 'select',
        MULTI_CHECK: 'multi-check'
    }
};

function toSpaceCase(string) {
    return string.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
}

function toDashCase(string = '') {
    return string
        .replace(/([A-Z])/g, ' $1')
        .replace(/\s/g, '-')
        .toLowerCase();
}

class Script extends HTMLElement {

    waitFormSubmit({ type, placeholder, list = [] }) {
        return new Promise(resolve => {
            this.querySelectorAll('form *').forEach(item => {
                if (item.type === 'submit') return;
                if (item.tagName === 'H3') return;
                if (item.tagName === 'H4') return;
                item.value = '';
                item.style.display = 'none';
            });
            const element = this.querySelector(`[name=${type}]`);
            element.placeholder = toDashCase(placeholder);
            this.querySelector('h4').innerHTML = `${toSpaceCase(placeholder).toUpperCase()}`;
            switch (type) {
                case WIZARD.TYPES.CONFIRM:
                    break;
                case WIZARD.TYPES.NUMBER:
                case WIZARD.TYPES.TEXT:
                    break;
                case WIZARD.TYPES.SELECT:
                    element.innerHTML = '';
                    list.forEach(({ value, label }) => {
                        element.appendChild(Node(`<option value="${value}">${label}</option>`));
                    });
                    break;
                case WIZARD.TYPES.MULTI_CHECK:
                    element.innerHTML = '';
                    list.forEach(({ value, label }, index) => {
                        const markup = `
<div>
    <input id="multi-check_${index}" name="multi-check-values" value="${value}" type="checkbox"/>
    <label for="multi-check_${index}">${label}</label>
</div>`;
                        element.appendChild(Node(markup));
                    });
                    break;
            }

            element.style.display = 'inline-block';
            setTimeout(() => element.focus(), 50);
            this.addEventListener('submit', event => {
                event.preventDefault();
                if (type === WIZARD.TYPES.MULTI_CHECK) {
                    const values = [];
                    this.querySelector('form')['multi-check-values'].forEach(item => {
                        if (item.checked) values.push(item.value);
                    });
                    resolve(values);
                } else {
                    resolve(element.value);
                }
            });
        });
    }

    async start(array) {
        const results = {};
        for (const index in array) {
            const item = array[index];
            const { placeholder } = item;
            Object.assign(results, { [placeholder]: await this.waitFormSubmit(item) });
        }
        this.parentElement.removeChild(this);
        return results;
    }
}


import './style.scss';
import template from './template.html';
import { addCssClass, removeCssClass } from '../../../modules/html/html';

const mixin = element => {
    element.querySelector('h3').innerHTML = 'WIZARD';
    return element;
};

const tagName = 'i-wizard';
const selector = `.${tagName}`;
const exports = { tagName, selector, mixin, template };
export default exports;
