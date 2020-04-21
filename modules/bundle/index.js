import { manifest } from '../loaders/manifest';

export const pluginBundle = (name, callback) => {
    document.addEventListener(name, event => {
        event.detail.inject(callback);
    });
};

export const loadBundle = (route, frame, context) => {
    const item = route.replace('routes/', '').replace(/\//g, '-');
    return manifest(window.app.chunksManifest, item).then(() => {
        setTimeout(() => {
            document.dispatchEvent(new CustomEvent(route, {
                detail: {
                    inject: plugin => plugin.call(context, { frame })
                }
            }));
        });
    });
};
