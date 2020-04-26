import { manifest } from '../../../modules/loaders/manifest';
import { getElementPath } from '../../../modules/html/html';

export default async function () {
    const sounds = {};
    const audioPlayer = {
        playSound: (soundName, { loop = false } = {}) => {
            if (!sounds[soundName]) return;
            sounds[soundName].loop = loop;
            sounds[soundName].play();
        }
    };

    manifest(window.app.assetsManifest, 'sounds').then(audios => {
        audios.forEach(audio => {
            sounds[audio.getAttribute('data-name')] = audio;
        });
    });

    window.addEventListener('click', event => {
        const path = getElementPath(event.target);
        if (path.find(item => item.tagName === 'BUTTON') || path.find(item => item.tagName === 'A')) {
            audioPlayer.playSound('button-click');
        }
    });

    return { audioPlayer };
}
