import style from './style.css';
import template from './template.html';
import { elementClickable, elementSetters } from '../../../modules/templating/mixins';

const mixin = element => {
    elementSetters(element);
    elementClickable(element);
    return element;
};

const exports = { tagName: 'i-button', selector: `.${style.local}`, mixin, template };
export default exports;

