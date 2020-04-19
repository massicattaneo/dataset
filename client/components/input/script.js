import style from './style.css';
import template from './template.html';
import { addCssClass, removeCssClass } from '../../../modules/html/html';
import { elementSetters } from '../../../modules/templating/mixins';

const FILL_CLASS = 'fill';

const mixin = element => {
    elementSetters(element, 'input');
    const inputEl = element.querySelector('input');
    inputEl.addEventListener('focus', () => {
        addCssClass(element, FILL_CLASS);
    });
    inputEl.addEventListener('blur', () => {
        if (inputEl.value) return;
        removeCssClass(element, FILL_CLASS);
    });

    if (inputEl.value) addCssClass(element, FILL_CLASS);

    return element;
};

const exports = { tagName: 'i-input', selector: `.${style.local}`, mixin, template };
export default exports;

