import style from './style.css';
import template from './template.html';

const mixin = element => {
    return element;
};

const exports = { tagName: 'i-flow', selector: `.${style.local}`, mixin, template };
export default exports;

