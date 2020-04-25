import { manifest } from '../../../modules/loaders/manifest';
import { getElementPath } from '../../../modules/html/html';

export default async function () {
    const sounds = {};

    manifest(window.app.assetsManifest, 'sounds').then(audios => {
        audios.forEach(audio => {
            sounds[audio.getAttribute('data-name')] = audio;
        });
    });

    window.addEventListener('click', event => {
        const path = getElementPath(event.target);
        if (!sounds['button-click']) return;
        if (path.find(item => item.tagName === 'BUTTON') || path.find(item => item.tagName === 'A')) {
            sounds['button-click'].play();
        }
    });

    return {};
}
