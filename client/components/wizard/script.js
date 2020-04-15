import './style.scss';
import template from './template.html';
import { Node } from '../../../modules/html/html';

export const WIZARD = {
    TYPES: {
        CONFIRM: 'confirm',
        NUMBER: 'number',
        TEXT: 'text',
        EMAIL: 'email',
        DATE: 'date',
        PASSWORD: 'password',
        TEXT_AREA: 'textarea',
        SELECT: 'select',
        MULTI_CHECK: 'multi-check'
    }
};

function getMulticheckMarkup(index, value, label) {
    return `
<div>
    <input id="multi-check_${index}" name="multi-check-values" value="${value}" type="checkbox"/>
    <label for="multi-check_${index}">${label}</label>
</div>`;
}

function hideFormElements(element) {
    element.querySelectorAll('form > *')
        .forEach(item => {
            if (item.type === 'submit') return;
            if (item.tagName === 'H3') return;
            if (item.tagName === 'H4') return;
            item.value = '';
            item.style.display = 'none';
        });
}

const mixin = element => {

    element.start = async ({ list, title = '' }) => {
        const results = {};
        element.style.display = 'block';
        element.querySelector('h3').innerHTML = title;
        for (const index in list) {
            const item = list[index];
            const { name } = item;
            Object.assign(results, { [name]: await waitFormSubmit(item) });
        }
        setTimeout(() => element.style.display = 'none', 500);
        return results;
    };

    const waitFormSubmit = ({ type, placeholder, description, list = [] }) => {
        return new Promise(resolve => {
            hideFormElements(element);
            const el = element.querySelector(`[data-type=${type}]`);
            element.querySelector('h4').innerHTML = description || '';
            el.setValue(placeholder || '...', '.placeholder');
            switch (type) {
            case WIZARD.TYPES.CONFIRM:
                break;
            case WIZARD.TYPES.EMAIL:
            case WIZARD.TYPES.NUMBER:
            case WIZARD.TYPES.TEXT:
                break;
            case WIZARD.TYPES.SELECT:
                el.innerHTML = '';
                list.forEach(({ value, label }) => {
                    el.appendChild(Node(`<option value="${value}">${label}</option>`));
                });
                break;
            case WIZARD.TYPES.MULTI_CHECK:
                el.innerHTML = '';
                list.forEach(({ value, label }, index) => {
                    const markup = getMulticheckMarkup(index, value, label);
                    el.appendChild(Node(markup));
                });
                break;
            }

            el.style.display = 'inline-block';
            setTimeout(() => el.focus(), 50);
            element.addEventListener('submit', event => {
                event.preventDefault();
                if (type === WIZARD.TYPES.MULTI_CHECK) {
                    const values = [];
                    element.querySelector('form')['multi-check-values'].forEach(item => {
                        if (item.checked) values.push(item.value);
                    });
                    resolve(values);
                } else {
                    resolve(el.getValue());
                }
            });
        });
    };

    return element;
};

const tagName = 'i-wizard';
const selector = `.${tagName}`;
const exports = { tagName, selector, mixin, template };
export default exports;
