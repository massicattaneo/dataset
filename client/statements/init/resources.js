import { addCssClass, removeCssClass } from '../../../modules/html/html';
import { manifest } from '../../../modules/loaders/manifest';

const files = [
    { url: 'assets/fonts/icofont/icofont.ttf', name: 'IconsFont' },
    { url: 'assets/fonts/icofont.css' }
];

export default async function () {
    const element = document.getElementById('loader');
    await manifest(files);
    const loader = {
        start: () => addCssClass(element, 'loading'),
        stop: () => removeCssClass(element, 'loading')
    };

    loader.stop();

    return { loader };
}
