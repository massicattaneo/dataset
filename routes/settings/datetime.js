import { initClock } from '../../modules/canvas-clock';

export default async function ({ frame }) {
    const { store } = this;
    frame.iPosition({ width: 220, height: 300 });
    initClock(frame.querySelector('canvas'));
    const text = new Intl.DateTimeFormat(store.language.get(), {
        weekday: 'long',
        year: 'numeric',
        day: 'numeric',
        month: 'long'
    }).format(Date.now());
    frame.querySelector('p').innerText = text;
}
