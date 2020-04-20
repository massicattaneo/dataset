import { create } from '../../../modules/reactive/Reactive';

export default async function () {
    const [, language = 'en'] = location.pathname.split('/');
    const store = create({
        version: '1.0.0',
        language
    });
    return { store };
}
