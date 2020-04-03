export default async function () {
    const { thread } = this;
    thread.onError(error => {
        const { locale, home } = this;
        const text = locale ? locale.get({ path: 'error/loading/file', ...error }) : 'Something went wrong';
        if (home) {
            home.notification.show('error', text);
        } else {
            alert(text);
        }
    });
}
