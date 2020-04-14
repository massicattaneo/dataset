import './style.scss';
import template from './template.html';
import { elementClickable, elementSetters } from '../../../modules/templating/mixins';

const mixin = element => {
    elementSetters(element);
    elementClickable(element);
    return element;
};

const tagName = 'i-button';
const selector = `.${tagName}`;
const exports = { tagName, selector, mixin, template };
export default exports;

