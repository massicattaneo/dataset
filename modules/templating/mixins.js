import { addCssClass, removeCssClass } from '../html/html';
import './mixins-clickable.css';

const getElementValue = (element, selector) => {
    const selected = element.querySelector(selector);
    if (selected.value) {
        return selected.value;
    }
    return selected.innerText;

};
const setElementValue = (element, selector, text) => {
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
    element.iGetValue = (selector = defaultSelector) => getElementValue(element, selector);
    element.iSetValue = (text, selector = defaultSelector) => setElementValue(element, selector, text);
    element.iSetAttribute = (name, text, selector = defaultSelector) => setElementAttribute(element, selector, name, text);
};

export const elementClickable = element => {
    const onClick = () => {
        const onEnd = () => {
            element.removeEventListener('animationend', onEnd);
            removeCssClass(element, 'i-clicked');
        };
        element.addEventListener('animationend', onEnd);
        addCssClass(element, 'i-clicked');
    };
    element.addEventListener('click', onClick);
};
