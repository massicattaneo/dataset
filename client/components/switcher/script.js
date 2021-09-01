import style from './style.css';
import template from './template.html';
import { elementClickable, elementReactive } from '../../../modules/templating/mixins';

const mixin = element => {
    const disposeClicks = elementClickable(element.querySelector('.wrapper'));
    const { dispose } = elementReactive(element);
    return () => {
        disposeClicks();
        dispose();
    };
};

const exports = { tagName: 'iswitcher', selector: `.${style.local}`, mixin, template };
export default exports;
