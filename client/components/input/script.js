import style from './style.css';
import template from './template.html';
import { addCssClass, removeCssClass } from '../../../modules/html/html';
import { elementSetters } from '../../../modules/templating/mixins';

const FILL_CLASS = 'fill';

const mixin = element => {
    elementSetters(element, 'input');
    const inputEl = element.querySelector('input');
    const onFocus = () => {
        addCssClass(element, FILL_CLASS);
    };
    const onBlur = () => {
        if (inputEl.value) return;
        removeCssClass(element, FILL_CLASS);
    };

    if (inputEl.value) addCssClass(element, FILL_CLASS);
    inputEl.addEventListener('focus', onFocus);
    inputEl.addEventListener('blur', onBlur);

    return () => {
        inputEl.removeEventListener('focus', onFocus);
        inputEl.removeEventListener('blur', onBlur);
    };
};

const exports = { tagName: 'iinput', selector: `.${style.local}`, mixin, template };
export default exports;

