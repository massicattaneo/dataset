import './style.scss';
import template from './template.html';
import { addCssClass, removeCssClass } from '../../../modules/html/html';

const FILL_CLASS = 'fill';

const mixin = element => {
    const inputEl = element.querySelector('input');
    inputEl.addEventListener('focus', () => {
        addCssClass(element, FILL_CLASS);
    });
    inputEl.addEventListener('blur', () => {
        if (!inputEl.value) {
            removeCssClass(element, FILL_CLASS);
        }
    });
    if (inputEl.value) {
        addCssClass(element, FILL_CLASS);
    }
    return element;
};

const tagName = 'i-input';
const selector = `.${tagName}`;
const exports = { tagName, selector, mixin, template };
export default exports;

