import { getComputed } from '../../../modules/html/html';

export default async function () {
    const { frame, page, thread } = this;
    const { store } = this.sharedContext;

    const onSubmit = async event => {
        event.preventDefault();
        event.stopPropagation();
        switch (event.target.pageIndex.value) {
        case '0':
            await thread.main('validate', event.target.firstname, ['required']).subscribe();
            await thread.main('validate', event.target.surname, ['required']).subscribe();
            await thread.main('validate', event.target.email, ['required', 'email']).subscribe();
            await thread.main('validate', event.target.password, ['required', 'length|8']).subscribe();
            await thread.main('validate', event.target.privacy, ['checked']).subscribe();
            page.flow.iGoToPage();
            break;
        case '1':
            thread
                .main('validate', event.target.password, ['required'])
                .subscribe()
                .then(() => page.flow.iGoToPage());
            break;
        }
    };

    const onChangePage = ({ detail }) => {
        const querySelector = detail.fieldset.querySelector('input');
        querySelector && querySelector.focus();
    };

    const resize = () => page.flow.resize(getComputed(frame, 'width'));

    page.flow.addEventListener('submit', onSubmit);
    page.flow.addEventListener('change-page', onChangePage);
    frame.addEventListener('resize', resize);
    resize();
    page.flow.iGoToPage(0);
    return () => {
        page.flow.removeEventListener('submit', onSubmit);
        page.flow.removeEventListener('change-page', onChangePage);
        frame.removeEventListener('resize', resize);
    };
}
