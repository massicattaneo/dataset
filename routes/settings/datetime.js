import { initClock } from '../../modules/canvas-clock';
import style from './datetime.css';
import template from './datetime.html';
import { pluginBundle } from '../../modules/bundle';

const options = {
    route: 'routes/settings/datetime',
    template,
    style
};

pluginBundle(options, async function () {
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
});
