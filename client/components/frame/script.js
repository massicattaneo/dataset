import style from './style.css';
import template from './template.html';
import { draggable, getComputed } from '../../../modules/html/html';
import { isDesktop, isMobile } from '../../../modules/device/device-client';
import { elementEmitter } from '../../../modules/templating/mixins';
import { STYLE } from '../../../constants';

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
        element.iShouldLoadContent() && element.load && element.load();
    };

    element.iShouldLoadContent = () => {
        const { height } = window.getComputedStyle(element);
        const windowHeight = Number(height.replace('px', ''));
        const remaining = content.scrollHeight - content.scrollTop - windowHeight;
        const customGap = 350;
        return (remaining + customGap < windowHeight);
    };

    element.iSetContent = htmlElement => {
        element.querySelector('.content').appendChild(htmlElement);
    };

    element.iPosition = ({ width, height }) => {
        if (!isDesktop) return;
        const availableHeight = window.innerHeight - STYLE.HOME_FOOTER_HEIGHT - STYLE.HOME_HEADER_HEIGHT;
        const availableWidth = window.innerWidth;
        element.style.width = width ? `${Math.min(width, availableWidth)}px` : '';
        element.style.height = height ? `${Math.min(height, availableHeight)}px` : '';
        const winWidth = getComputed(element, 'width');
        const winHeight = getComputed(element, 'height');
        const lft = (availableWidth - winWidth) / 2 + STYLE.HOME_HEADER_HEIGHT;
        const tp = (availableHeight - winHeight) / 2;
        element.style.left = `${lft}px`;
        element.style.top = `${tp}px`;
    };

    element.iClose = () => {
        closeElement.removeEventListener('click', onClose);
        dragDisposer();
        resizeObserver.unobserve(element);
        element.parentNode.removeChild(element);
        arguments[0] && emit('close');
    };

    const onClose = () => {

    };
    closeElement.addEventListener('click', () => element.iClose(true));
    element.resize();

    return element;
};

const exports = { tagName: 'i-frame', selector: `.${style.local}`, mixin, template };
export default exports;

