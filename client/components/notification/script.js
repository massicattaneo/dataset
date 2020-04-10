import './style.scss';
import template from './template.html';
import { addCssClass, removeCssClass } from '../../../modules/html/html';

const ICONS = {
    info: 'icofont-info-circle',
    warn: 'icofont-warning-alt',
    success: 'icofont-verification-check',
    error: 'icofont-error'
};

const types = ['info', 'warn', 'success', 'error'];

const mixin = element => {
    element.show = (type, text, timeout = 0) => {
        debugger;
        removeCssClass(element, ...types);
        removeCssClass(element.children[0].children[0], ...(types.map(type => ICONS[type])));
        addCssClass(element, type);
        addCssClass(element.children[0].children[0], ICONS[type]);
        const textEl = element.children[0].children[1];
        textEl.innerHTML = text;
        setTimeout(() => addCssClass(element, 'show'));
        if (timeout) {
            setTimeout(() => element.hide(), timeout);
        }
    };

    element.hide = () => {
        removeCssClass(element, 'show');
    };
    return element;
};

const tagName = 'i-notification';
const selector = `.${tagName}`;
const exports = { tagName, selector, mixin, template };
export default exports;

