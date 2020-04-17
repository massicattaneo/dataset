import style from './style.css';
import { getElementPath } from '../../../modules/html/html';
import template from './template.html';
import { STYLE } from '../../../constants';

const mixin = element => {
    const content = element.querySelector('.content');

    element.show = htmlContent => {
        content.appendChild(htmlContent);
        element.style.display = 'block';
        element.addEventListener('click', bgClick);
        setTimeout(() => {
            const { height } = window.getComputedStyle(content);
            const numHeight = Number(height.replace('px', '')) / 2;
            content.style.marginTop = `-${numHeight + STYLE.HOME_FOOTER_HEIGHT}px`;
            element.style.opacity = 1;
        });
    };

    element.close = () => {
        element.removeEventListener('click', bgClick);
        element.style.opacity = 0;
        setTimeout(() => element.style.display = 'none', 500);
    };

    const bgClick = event => {
        const path = getElementPath(event.target);
        if (path[0] === element) element.close();
    };

    return element;
};

const exports = { tagName: 'i-dialog', selector: `.${style.local}`, mixin, template };
export default exports;


