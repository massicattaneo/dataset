export default async function () {
    window.addEventListener('keydown', event => {
        if (event.code === 'Escape') window.history.back()
    });
}
