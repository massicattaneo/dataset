export default async function () {
    const { locales, thread, home } = this;
    thread.onError(error => {
        const text = locales.get({ path: 'error/loading/file', ...error });
        home.notification.show('error', text);
    });
}
