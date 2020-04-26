import style from './style.css';
import template from './template.html';
import { elementClickable, elementSetters } from '../../../modules/templating/mixins';

const mixin = element => {
    elementSetters(element);
    const dispose = elementClickable(element);
    return () => {
        dispose();
    };
};

const exports = { tagName: 'ibutton', selector: `.${style.local}`, mixin, template };
export default exports;

