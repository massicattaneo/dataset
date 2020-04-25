import { getComputed } from '../../../modules/html/html';

export default async function () {
    const { frame, page, thread } = this;
    const { store } = this.sharedContext;

    page.flow.addEventListener('submit', event => {
        event.preventDefault();
        event.stopPropagation();
        switch (event.target.pageIndex.value) {
        case '0':
            thread
                .main('validate', event.target.email, ['required', 'email'])
                .subscribe()
                .then(() => page.flow.iGoToPage());
            break;
        case '1':
            thread
                .main('validate', event.target.password, ['required'])
                .subscribe()
                .then(() => page.flow.iGoToPage());
            break;
        }
    });

    page.flow.addEventListener('change-page', ({ detail }) => {
        const querySelector = detail.fieldset.querySelector('input');
        querySelector && querySelector.focus();
    });

    const resize = () => {
        const width = getComputed(frame, 'width');
        page.flow.resize(width);
    };

    frame.addEventListener('resize', resize);
    resize();
    page.flow.iGoToPage(0);

}
