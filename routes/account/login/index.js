import { getComputed } from '../../../modules/html/html';

export default async function () {
    const { frame, page } = this;
    const { store } = this.sharedContext;
    page.flow.addEventListener('submit', event => {
        event.preventDefault();
        page.flow.iGoToPage();
    });

    const resize = () => {
        const width = getComputed(frame, 'width');
        page.flow.resize(width);
    };
    frame.addEventListener('resize', resize);
    resize();
    page.flow.iGoToPage(0);

}
