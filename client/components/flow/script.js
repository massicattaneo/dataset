import style from './style.css';
import template from './template.html';
import { addCssClass, removeCssClass } from '../../../modules/html/html';

const mixin = element => {
    const legendSteps = element.querySelectorAll('.legend-step');
    const contentSteps = element.querySelectorAll('.content-step');
    let actualStep = 0;
    element.addEventListener('submit', event => {
        event.preventDefault();
        addCssClass(legendSteps[actualStep], style.done);
        removeCssClass(legendSteps[actualStep], style.active);
        removeCssClass(contentSteps[actualStep], style.active);
        actualStep++;
        addCssClass(legendSteps[actualStep], style.active);
        addCssClass(contentSteps[actualStep], style.active);
    });
    addCssClass(legendSteps[actualStep], style.active);
    addCssClass(contentSteps[actualStep], style.active);
    return element;
};

const exports = { tagName: 'iflow', selector: `.${style.local}`, mixin, template };
export default exports;

