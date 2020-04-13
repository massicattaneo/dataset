import './style.scss';
import template from './template.html';
import { addCssClass, removeCssClass } from '../../../modules/html/html';
import { elementSetters } from '../../../modules/templating/mixins';

const mixin = element => {
    elementSetters(element);
    const onClick = () => {
        const onEnd = () => {
            element.removeEventListener('animationend', onEnd);
            removeCssClass(element, 'clicked');
        };
        element.addEventListener('animationend', onEnd);
        addCssClass(element, 'clicked');
    };
    element.addEventListener('click', onClick);
    return element;
};

const tagName = 'i-button';
const selector = `.${tagName}`;
const exports = { tagName, selector, mixin, template };
export default exports;

