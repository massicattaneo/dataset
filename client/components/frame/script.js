import style from './style.css';
import template from './template.html';
import { draggable, getComputed } from '../../../modules/html/html';
import { isDesktop, isMobile } from '../../../modules/device/device-client';
import { elementEmitter, elementSetters } from '../../../modules/templating/mixins';
import { STYLE } from '../../../constants';

function setLeft(element, availableWidth, position) {
    const keys = Object.keys(position);
    const winWidth = getComputed(element, 'width');
    if (keys.includes('center')) {
        element.style.left = `${(availableWidth - winWidth) / 2}px`;
    }
    if (keys.includes('left')) {
        element.style.left = `${position.left}px`;
    }
    if (keys.includes('right')) {
        element.style.right = `${position.right}px`;
    }
}

function setTop(element, availableHeight, position) {
    const keys = Object.keys(position);
    const winHeight = getComputed(element, 'height');
    if (keys.includes('center')) {
        element.style.top = `${(availableHeight - winHeight) / 2 + STYLE.HOME_HEADER_HEIGHT}px`;
    }
    if (keys.includes('top')) {
        element.style.top = `${position.top+ STYLE.HOME_HEADER_HEIGHT}px`;
    }

    if (keys.includes('bottom')) {
        element.style.bottom = `${position.bottom}px`;
    }
}

const mixin = element => {
    elementSetters(element, '.title');
    const emit = elementEmitter(element);
    const closeElement = element.querySelector('.close');
    const content = element.querySelector('.content');
    const title = element.querySelector('.title');
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
        content.appendChild(htmlElement);
    };

    element.iPosition = ({ width, height, position = { center: 0 } }) => {
        if (!isDesktop) return;
        const availableHeight = window.innerHeight - STYLE.HOME_FOOTER_HEIGHT - STYLE.HOME_HEADER_HEIGHT;
        const availableWidth = window.innerWidth;
        element.style.width = width ? `${Math.min(width, availableWidth)}px` : '';
        element.style.height = height ? `${Math.min(height, availableHeight)}px` : '';
        setLeft(element, availableWidth, position);
        setTop(element, availableHeight, position);
    };

    element.iClose = () => {
        closeElement.removeEventListener('click', onClose);
        dragDisposer();
        resizeObserver.unobserve(element);
        element.parentNode.removeChild(element);
        arguments[0] && emit('close');
    };

    const onClose = () => element.iClose(true);
    closeElement.addEventListener('click', onClose);
    element.resize();

    return element;
};

const exports = { tagName: 'i-frame', selector: `.${style.local}`, mixin, template };
export default exports;

