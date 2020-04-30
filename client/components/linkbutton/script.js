import style from './style.css';
import template from './template.html';

const mixin = element => {
    return () => {};
};

const exports = { tagName: 'ilinkbutton', selector: `.${style.local}`, mixin, template };
export default exports;
