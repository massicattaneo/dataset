export default async function () {
    const window = await this.thread.main('create/window', { path: 'account/login' }).subscribe();
}
