import { connect } from '../../../modules/reactive/Reactive';
import { arrayToObject, flat } from '../../../modules/array/array';
import { ROUTES_PATH } from '../../../constants';

function getRouteMappings(locObj) {
    const { routes } = locObj;
    const routesToObject = (prefix, obj) => Object.keys(obj).map(key => {
        if (!obj[key].href && obj[key] instanceof Object) return routesToObject(`${prefix}${key}/`, obj[key]);
        return { href: obj[key].href, route: `${prefix}${key}` };
    });
    return routesToObject
        .partial(ROUTES_PATH)
        .compose(flat.argument(1, 10))
        .compose(arrayToObject.argument(1, 'href', 2, 'route'))
        .subscribe(routes);
}

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

    const routeMappings = {};

    await (new Promise((resolve) => {
        connect({ language: store.language }, async ({ language }) => {
            const loc = await fetch.partial(`/locale/${version}/${language}`).retry().subscribe()
                .then(res => res.json()).catch(resolve);
            const systemLoc = { system: { language: language.get() } };
            Object.assign(locObj, loc, systemLoc);
            Object.assign(routeMappings, getRouteMappings(locObj));
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
        all: () => locObj,
        route: href => routeMappings[href]
    };

    return { locale };
}

