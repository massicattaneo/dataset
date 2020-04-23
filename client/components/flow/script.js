import style from './style.css';
import template from './template.html';
import { addCssClass, getComputed, removeCssClass } from '../../../modules/html/html';
import { findIndex } from '../../../modules/array/array';

const mixin = element => {
    const legendSteps = Array.prototype.slice.call(element.querySelectorAll('.legend-step'));
    const contentSteps = Array.prototype.slice.call(element.querySelectorAll('.content-step'));
    let actualStep = 0;
    let parentWidth = 0;
    element.iGoToPage = (nextPage = (actualStep + 1)) => {
        legendSteps.forEach((el, index) => {
            removeCssClass(el, style.done);
            removeCssClass(el, style.active);
            contentSteps.forEach(item => {
                item.style.left = `${-nextPage * parentWidth}px`;
            });
            if (index === nextPage) {
                addCssClass(el, style.active);
            } else if (index < nextPage) {
                addCssClass(el, style.done);
            }
        });
        actualStep = nextPage;
    };

    element.addEventListener('click', event => {
        if (legendSteps.includes(event.target)) {
            const index = findIndex(legendSteps, item => item === event.target);
            element.iGoToPage(index);
        }
    });

    element.resize = (width, height) => {
        parentWidth = width;
        contentSteps.forEach(el => el.style.width = `${width}px`);
        element.querySelector('.pages').style.width = `${width * legendSteps.length}px`;
    };

    return element;
};

const exports = { tagName: 'iflow', selector: `.${style.local}`, mixin, template };
export default exports;

