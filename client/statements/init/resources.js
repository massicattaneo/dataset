import { addCssClass, removeCssClass } from '../../../modules/html/html';
import { manifest } from '../../../modules/loaders/manifest';

export default async function () {
    const element = document.getElementById('loader');
    await manifest(window.manifest, 'init');
    const loadingClass = 'loading';
    const loader = {
        start: () => addCssClass(element, loadingClass),
        stop: () => removeCssClass(element, loadingClass)
    };

    loader.stop();

    return { loader };
}
