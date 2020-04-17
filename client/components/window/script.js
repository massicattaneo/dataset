import style from './style.css';
import template from './template.html';
import { draggable } from '../../../modules/html/html';
import { isDesktop, isMobile } from '../../../modules/device/device-client';

const mixin = element => {

    element.resize = () => {
        if (isMobile) return;
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

    element.setContent = htmlElement => {
        element.querySelector('.content').appendChild(htmlElement)
    };

    element.onChanges = ({ top, left, width, height }) => {

    };

    element.close = () => {

    };

    if (isDesktop) {
        draggable(element, element.querySelector('.bar'), (x, y) => {
            element.style.left = `${x}px`;
            element.style.top = `${y}px`;
            element.onChanges(window.getComputedStyle(element));
        });
    }


    element.querySelector('.close').addEventListener('click', () => {
        element.close();
    });

    const myObserver = new ResizeObserver(() => element.resize());
    myObserver.observe(element);
    element.listeners = [];
    element.content = element.querySelector('.content');
    element.heightMargin = 40;
    element.resize();

    return element;
};

const exports = { tagName: 'i-window', selector: `.${style.local}`, mixin, template };
export default exports;

