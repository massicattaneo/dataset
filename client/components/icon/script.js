import style from './style.css';
import template from './template.html';
import { elementClickable } from '../../../modules/templating/mixins';

const mixin = element => {
    const dispose = elementClickable(element);
    return () => {
        dispose();
    };
};

const exports = { tagName: 'iicon', selector: `.${style.local}`, mixin, template };
export default exports;

