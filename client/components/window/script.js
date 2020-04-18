import style from './style.css';
import template from './template.html';
import { draggable } from '../../../modules/html/html';
import { isDesktop, isMobile } from '../../../modules/device/device-client';
import { elementEmitter } from '../../../modules/templating/mixins';

const mixin = element => {
    const emit = elementEmitter(element);
    const closeElement = element.querySelector('.close');
    const content = element.querySelector('.content');
    const resizeObserver = new ResizeObserver(() => element.resize());
    resizeObserver.observe(element);

    const dragDisposer = isDesktop ? draggable(element, element.querySelector('.bar'), (x, y) => {
        element.style.left = `${x}px`;
        element.style.top = `${y}px`;
        emit('layout', window.getComputedStyle(element));
    }) : e => e;

    element.resize = () => {
        if (isMobile) return;
        emit('layout', window.getComputedStyle(element));
        element.shouldLoadContent() && element.load && element.load();
    };

    element.shouldLoadContent = () => {
        const { height } = window.getComputedStyle(element);
        const windowHeight = Number(height.replace('px', ''));
        const remaining = content.scrollHeight - content.scrollTop - windowHeight;
        const customGap = 350;
        return (remaining + customGap < windowHeight);
    };

    element.setContent = htmlElement => {
        element.querySelector('.content').appendChild(htmlElement);
    };

    const onClose = () => {
        closeElement.removeEventListener('click', onClose);
        dragDisposer();
        resizeObserver.unobserve(element);
        element.parentNode.removeChild(element);
        emit('close');
    };
    closeElement.addEventListener('click', onClose);
    element.resize();

    return element;
};

const exports = { tagName: 'i-window', selector: `.${style.local}`, mixin, template };
export default exports;

