import './style.css';
import template from './template.html';
import { addCssClass, draggable, removeCssClass } from '../../../modules/html/html';

const mixin = element => {

    element.resize = () => {
        const { height } = window.getComputedStyle(element);
        const calc = Number(height.replace('px', '')) - element.heightMargin;
        element.content.style.height = `${calc}px`;
        element.onChanges(window.getComputedStyle(element));
        element.shouldLoadContent() && element.load && element.load();
    };

    element.shouldLoadContent = () => {
        const { height } = window.getComputedStyle(element);
        const windowHeight = Number(height.replace('px', ''));
        const remaining = element.content.scrollHeight - element.content.scrollTop - windowHeight;
        const customGap = 350;
        return (remaining + customGap < windowHeight);
    };

    element.onChanges = ({ top, left, width, height }) => {

    };

    element.close = () => {

    };

    draggable(element, element.querySelector('.bar'), (x, y) => {
        element.style.left = `${x}px`;
        element.style.top = `${y}px`;
        element.onChanges(window.getComputedStyle(element));
    });

    element.querySelector('.close').addEventListener('click', () => {
        element.close();
    });

    const myObserver = new ResizeObserver(() => element.resize());
    myObserver.observe(element);
    element.listeners = [];
    element.content = element.querySelector('.content');
    element.heightMargin = 40;
    element.style.width = `${element.getAttribute('width') || 800}px`;
    element.style.height = `${element.getAttribute('height') || 600}px`;
    element.resize();

    return element;
};

const tagName = 'i-window';
const selector = `.${tagName}`;
const exports = { tagName, selector, mixin, template };
export default exports;

