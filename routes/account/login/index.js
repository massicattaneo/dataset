export default async function () {
    const { frame, page } = this;
    const { store } = this.sharedContext;
    console.warn(page.flow)
}
