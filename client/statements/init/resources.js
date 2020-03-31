import { addCssClass, removeCssClass } from '../../../modules/html/html';
import { manifest } from '../../../modules/loaders/manifest';

export default async function () {
    const element = document.getElementById('loader');
    await manifest(window.manifest, 'init');
    const loader = {
        start: () => addCssClass(element, 'loading'),
        stop: () => removeCssClass(element, 'loading')
    };

    loader.stop();

    return { loader };
}
