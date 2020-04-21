import { addCssClass, removeCssClass, Node } from '../../../modules/html/html';
import { manifest } from '../../../modules/loaders/manifest';
import { createHeadInfoMarkup } from '../../../modules/templating/client';

export default async function () {
    const { locale } = this;
    const element = document.getElementById('loader');
    await manifest(window.app.assetsManifest, 'init');
    const loadingClass = 'loading';
    const loader = {
        start: () => addCssClass(element, loadingClass),
        stop: () => removeCssClass(element, loadingClass)
    };

    document.head.appendChild(Node(createHeadInfoMarkup(locale)));

    loader.stop();

    return { loader };
}
