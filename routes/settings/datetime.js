import { initClock } from '../../modules/canvas-clock';

export default async function () {
    const { frame } = this;
    const { store } = this.sharedContext;
    initClock(frame.querySelector('canvas'));
    const text = new Intl.DateTimeFormat(store.language.get(), {
        weekday: 'long',
        year: 'numeric',
        day: 'numeric',
        month: 'long'
    }).format(Date.now());
    frame.querySelector('p').innerText = text;
}
