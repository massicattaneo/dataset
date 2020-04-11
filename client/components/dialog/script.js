import './style.scss';
import { getElementPath } from '../../../modules/html/html';
import template from './template.html';

const mixin = element => {
    const content = element.querySelector('.content');

    element.show = htmlContent => {
        content.innerHTML = htmlContent;
        element.style.display = 'block';
        const { height } = window.getComputedStyle(content);
        const numHeight = Number(height.replace('px', '')) / 2;
        content.style.marginTop = `-${numHeight}px`;
        element.addEventListener('click', bgClick);
    };

    element.close = () => {
        element.removeEventListener('click', bgClick);
        element.style.display = 'none';
    };

    const bgClick = event => {
        const path = getElementPath(event.target);
        if (path[0] === element) element.close();
    };

    return element;
};

const tagName = 'i-dialog';
const selector = `.${tagName}`;
const exports = { tagName, selector, mixin, template };
export default exports;


