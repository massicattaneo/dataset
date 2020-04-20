import style from './style.css';
import template from './template.html';
import { elementSetters } from '../../../modules/templating/mixins';

const mixin = element => {
    elementSetters(element, '.content');
    return element;
};

const exports = { tagName: 'i-breadcrumb', selector: `.${style.local}`, mixin, template };
export default exports;

