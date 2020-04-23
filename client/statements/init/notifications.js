function showError(home, type, text, timeout = 0) {
    if (home) {
        home.notification.show(type, text, timeout);
    } else {
        alert(text);
    }
}

export default async function () {
    const { thread } = this;
    thread.onError(error => {
        const { home, locale } = this;
        if (error instanceof Error) {
            return showError(home, 'error', error.toString());
        }
        if (locale) {
            const { path, timeout = 2000 } = error;
            delete error.path;
            delete error.timeout;
            const text = locale.get(path, error);
            showError(home, path.split('/')[1], text, timeout);
        }
    });
}
