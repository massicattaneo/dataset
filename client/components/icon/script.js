import './style.css';
import template from './template.html';
import { addCssClass, removeCssClass } from '../../../modules/html/html';

const mixin = element => {
    return element;
};

const tagName = 'i-icon';
const selector = `.${tagName}`;
const exports = { tagName, selector, mixin, template };
export default exports;

