import { addCssClass, removeCssClass, Node } from '../../../modules/html/html';
import { manifest } from '../../../modules/loaders/manifest';
import { createHeadInfoMarkup } from '../../../modules/templating/client';
import { wait } from '../../../modules/wait/wait';

export default async function () {
    const { locale } = this;
    const element = document.getElementById('loader');
    await manifest(window.app.assetsManifest, 'init');
    const loadingClass = 'loading';
    const loader = {
        start: () => addCssClass(element, loadingClass),
        stop: () => setTimeout(() => removeCssClass(element, loadingClass), 200)
    };


    document.head.appendChild(Node(createHeadInfoMarkup(locale)));
    // await wait.time(500);
    loader.stop();

    return { loader };
}
