import './style.scss';
import template from './template.html';
import { addCssClass, removeCssClass } from '../../../modules/html/html';
import { elementClickable } from '../../../modules/templating/mixins';

const mixin = element => {
    elementClickable(element);
    return element;
};

const tagName = 'i-icon';
const selector = `.${tagName}`;
const exports = { tagName, selector, mixin, template };
export default exports;

