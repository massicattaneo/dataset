import { connect } from '../../../modules/reactive/Reactive';
import { arrayToObject, flat } from '../../../modules/array/array';
import { ROUTES_PATH } from '../../../constants';
import { sendRequest } from '../../fetch-utils';

function getRouteMappings(locObj) {
    const { routes } = locObj;
    const routesToObject = (prefix, obj) => Object.keys(obj).map(key => {
        if (!(obj[key] instanceof Object)) return [];
        const items = routesToObject(`${prefix}${key}/`, obj[key]);
        const ret = [];
        if (obj[key].href) ret.push({ href: obj[key].href, route: `${prefix}${key}` });
        return ret.concat(...items);
    });
    return routesToObject
        .partial(ROUTES_PATH)
        .compose(flat.argument(1, 10))
        .compose(arrayToObject.argument(1, 'href', 2, 'route'))
        .subscribe(routes);
}

export default async function () {
    const { store, thread } = this;
    const version = store.version.get();

    const locObj = {
        assetsManifest: window.app.assetsManifest.reduce((acc, item) => {
            acc[item.stage] = acc[item.stage] || {};
            acc[item.stage][item.name] = item.url;
            return acc;
        }, {})
    };

    const routeMappings = {};

    await (new Promise((resolve) => {
        connect({ language: store.language }, async ({ language }) => {
            const loc = await (sendRequest.partial('GET', `/locale/${version}/${language}`, {}).retry().subscribe())
                .catch(resolve);
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

