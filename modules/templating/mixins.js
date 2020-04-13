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

export const elementSetters = element => {
    element.setValue = (selector, text) => setElementValue(element, selector, text);
    element.setAttribute = (selector, name, text) => setElementAttribute(element, selector, name, text);
};
