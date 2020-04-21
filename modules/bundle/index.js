import { manifest } from '../loaders/manifest';

export const pluginBundle = (name, callback) => {
    document.addEventListener(name, event => {
        event.detail.inject(callback);
    });
};

export const loadBundle = (route, frame, context) => {
    const stages = route.replace('routes/', '').replace(/\//g, '-');
    frame.iPosition(window.app.chunksManifest.find(({ stage }) => stage === stages).defaults);
    return manifest(window.app.chunksManifest, stages).then(() => {
        document.dispatchEvent(new CustomEvent(route, {
            detail: {
                inject: plugin => plugin.call(context, { frame })
            }
        }));
    });
};
