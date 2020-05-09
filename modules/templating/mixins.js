import { addCssClass, getElementValue, removeCssClass } from '../html/html';
import './mixins-clickable.css';
import { EventEmitter } from '../event-emitter/EventEmitter';

const getElementValueBySelector = (element, selector) => {
    return getElementValue(element.querySelector(selector))
};
const setElementValueBySelector = (element, selector, text) => {
    const selected = element.querySelector(selector);
    if (selected.value) {
        selected.value = text;
    } else {
        selected.innerText = text;
    }
};

const setElementAttribute = (element, selector, name, value) => {
    const selected = element.querySelector(selector);
    selected.setAttribute(name, value);
};

export const elementSetters = (element, defaultSelector) => {
    element.iGetValue = (selector = defaultSelector) => getElementValueBySelector(element, selector);
    element.iSetValue = (text, selector = defaultSelector) => setElementValueBySelector(element, selector, text);
    element.iSetHtml = (html, selector = defaultSelector) => element.querySelector(selector).innerHTML = html;
    element.iSetAttribute = (name, text, selector = defaultSelector) => setElementAttribute(element, selector, name, text);
};

export const elementClickable = element => {
    const onEnd = () => {
        element.removeEventListener('animationend', onEnd);
        removeCssClass(element, 'i-clicked');
    };
    const onClick = () => {
        element.addEventListener('animationend', onEnd);
        addCssClass(element, 'i-clicked');
    };
    element.addEventListener('click', onClick);
    return () => {
        element.removeEventListener('click', onClick);
        element.removeEventListener('animationend', onEnd);
    }
};

export const elementEmitter = element => {
    const emitter = EventEmitter();
    element.iOn = emitter.on;
    return emitter.emit;
};
