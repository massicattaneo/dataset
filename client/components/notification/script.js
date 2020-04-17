import style from './style.css';
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
        removeCssClass(element, ...types.map(type => style[type]));
        removeCssClass(element.children[0].children[0], ...(types.map(type => ICONS[type])));
        addCssClass(element, style[type]);
        addCssClass(element.children[0].children[0], ICONS[type]);
        const textEl = element.children[0].children[1];
        textEl.innerHTML = text;
        setTimeout(() => addCssClass(element, style.show));
        if (timeout) {
            setTimeout(() => element.hide(), timeout);
        }
    };

    element.hide = () => {
        removeCssClass(element, 'show');
    };
    return element;
};

const exports = { tagName: 'i-notification', selector: `.${style.local}`, mixin, template };
export default exports;

