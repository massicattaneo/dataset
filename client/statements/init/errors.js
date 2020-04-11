export default async function () {
    const { thread } = this;
    thread.onError(error => {
        const { locale, home } = this;
        let text = 'Something went wrong';
        if (locale) {
            text = locale.get({ path: 'error/loading/file', ...error });
        }
        if (error instanceof Error) {
            text = error.toString();
        }
        if (home) {
            home.notification.show('error', text);
        } else {
            alert(text);
        }
    });
}
