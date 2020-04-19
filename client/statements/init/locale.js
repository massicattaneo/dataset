import { connect } from '../../../modules/reactive/Reactive';

export default async function () {
    const { store } = this;
    const version = store.version.get();

    const locObj = {
        manifest: window.manifest.reduce((acc, item) => {
            acc[item.stage] = acc[item.stage] || {};
            acc[item.stage][item.name] = item.url;
            return acc;
        }, {})
    };

    await (new Promise((resolve) => {
        connect({ language: store.language }, async ({ language }) => {
            const loc = await fetch.partial(`/locale/${version}/${language}`).retry().subscribe()
                .then(res => res.json()).catch(resolve);
            Object.assign(locObj, loc);
            window.document.setA
            resolve();
        });
    }));

    const locale = {
        get: (path, parameters = {}) => {
            const reduce = path.split('/')
                .reduce((obj, string) => obj[string], locObj);
            return Object.keys(parameters).reduce((string, key) => {
                return string.replace(new RegExp(`{{${key}}}`, 'g'), parameters[key]);
            }, reduce);
        },
        all: () => locObj
    };

    return { locale };
}

