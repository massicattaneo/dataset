import template from './index.html';
import style from './index.css';

export const markup = () => {
    return template.replace('>', ` class="${style.local}">`);
};
