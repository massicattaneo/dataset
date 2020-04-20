import { isDesktop } from '../../../modules/device/device-client';

const setClock = (store, options, home) => {
    const text = new Intl.DateTimeFormat(store.language.get(), options).format(Date.now());
    home.querySelector('.datetime').innerText = text;
};

export default async function () {
    const { home, store } = this;
    if (isDesktop) {
        const options = { weekday: 'long', hour: 'numeric', minute: 'numeric' };
        setInterval(() => setClock(store, options, home), 5000);
        setClock(store, options, home);
    }
}
