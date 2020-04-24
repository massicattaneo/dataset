export default async function () {
    window.addEventListener('keydown', event => {
        console.warn(event.code, event);
        if (event.code === 'Escape') history.back()
    });
}
