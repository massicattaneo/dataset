import { create } from '../../../modules/reactive/Reactive';
import { DEFAULT_LANGUAGE } from '../../../constants';

export default async function () {
    const [, language] = location.pathname.split('/').map(i => i || DEFAULT_LANGUAGE);
    const store = create({
        version: '1.0.0',
        language
    });
    return { store };
}
