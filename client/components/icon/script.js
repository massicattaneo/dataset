import style from './style.css';
import template from './template.html';
import { elementClickable } from '../../../modules/templating/mixins';

const mixin = element => {
    elementClickable(element);
    return element;
};

const exports = { tagName: 'i-icon', selector: `.${style.local}`, mixin, template };
export default exports;

