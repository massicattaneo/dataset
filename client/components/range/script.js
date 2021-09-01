import style from './style.css';
import template from './template.html';
import { elementReactive } from '../../../modules/templating/mixins';

const mixin = element => {
    const { dispose } = elementReactive(element, value => {
        element.querySelector('em span').innerText = value;
    });
    return () => {
        dispose();
    };
};

const exports = { tagName: 'irange', selector: `.${style.local}`, mixin, template };
export default exports;
