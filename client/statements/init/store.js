import { create } from '../../../modules/reactive/Reactive';

export default async function () {
    const store = create({
        version: '1.0.0',
        language: 'en',
        tables: []
    });
    return { store };
}
