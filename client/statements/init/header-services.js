import { isDesktop } from '../../../modules/device/device-client';

const setClock = (store, home) => {
    const options = { weekday: 'long', hour: 'numeric', minute: 'numeric' };
    const text = new Intl.DateTimeFormat(store.language.get(), options).format(Date.now());
    home.querySelector('.datetime').innerText = text;
};

export default async function () {
    const { home, store, locale } = this;
    if (isDesktop) {
        setInterval(() => setClock(store, home), 5000);
        setClock(store, home);
    }
    document.body.style.backgroundImage = `url('${locale.get('assetsManifest/init/pattern')}')`
}
