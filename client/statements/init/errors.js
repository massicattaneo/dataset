export default async function () {
    const { thread } = this;
    thread.onError(error => {
        const { home } = this;
        let text = 'Something went wrong';
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
