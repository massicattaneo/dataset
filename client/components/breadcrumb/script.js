import style from './style.css';
import template from './template.html';
import { elementSetters } from '../../../modules/templating/mixins';

const mixin = element => {
    elementSetters(element, '.content');
    return () => {};
};

const exports = { tagName: 'ibreadcrumb', selector: `.${style.local}`, mixin, template };
export default exports;

