import { create } from '../../../modules/reactive/Reactive';
import { device } from '../../../modules/device/Device';

export default async function () {
    const store = create({
        version: '1.0.0',
        language: 'en',
        device: device()
    });
    return { store };
}
