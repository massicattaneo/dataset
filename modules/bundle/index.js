import { manifest } from '../loaders/manifest';

export const pluginBundle = ({ route, template, style }, bootstrap) => {
    const markup = template.replace('>', ` class="${style.local}">`);
    document.addEventListener(route, event => {
        event.detail.inject({ bootstrap, markup, style });
    });
};

export const loadBundle = (route, frame, context) => {
    const stages = route.replace('routes/', '').replace(/\//g, '-');
    frame.iPosition(window.app.chunksManifest.find(({ stage }) => stage === stages).defaults || {});
    return new Promise((inject, reject) => {
        manifest(window.app.chunksManifest, stages).then(() => {
            document.dispatchEvent(new CustomEvent(route, { detail: { inject } }));
        }).catch(reject);
    });
};
