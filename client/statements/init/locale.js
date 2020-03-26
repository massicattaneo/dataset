import { connect } from '../../../modules/reactive/Reactive';

export default async function () {
    const language = this.store.language.get();
    const version = this.store.version.get();
    const locale = {};

    await (new Promise((resolve) => {
        connect({ language: this.store.language }, async ({ language }) => {
            const loc = await fetch.partial(`/locale/${version}/${language}`).retry().subscribe()
                .then(res => res.json()).catch(resolve);
            Object.assign(locale, loc);
            resolve();
        });
    }));

    const locales = {
        get: (parameters) => {
            const { path } = parameters;
            const reduce = path.split('/')
                .reduce((obj, string) => obj[string], locale);
            return Object.keys(parameters).reduce((string, key) => {
                return string.replace(new RegExp(`{{${key}}}`, 'g'), parameters[key]);
            }, reduce);
        }
    };
    return { locales };
}

