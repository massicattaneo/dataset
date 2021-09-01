import { create, toJSON, use } from '../../../modules/reactive/Reactive';
import { DEFAULT_LANGUAGE } from '../../../constants';

export default async function () {
    const [, language] = location.pathname.split('/').map(i => i || DEFAULT_LANGUAGE);
    const store = create({
        version: '1.0.0',
        language,
        timestamp: Date.now(),
        sounds: JSON.parse(window.localStorage.getItem('sounds')) || {
            volume: 100,
            clicks: false,
            master: true
        },
        user: {
            logged: false
        }
    });
    setInterval(() => store.timestamp.set(Date.now()), 5000);
    use(store.sounds, (data, next) => {
        data.volume.update(Number(data.volume));
        window.localStorage.setItem('sounds', JSON.stringify(toJSON(data)))
        next();
    });
    return { store };
}
