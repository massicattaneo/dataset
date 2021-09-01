export default async function () {
    const { frame, page } = this;
    const { store } = this.sharedContext;
    page.master.iReactive(store.sounds, 'master');
    page.clicks.iReactive(store.sounds, 'clicks');
    page.volume.iReactive(store.sounds, 'volume');
    return () => {};
}
