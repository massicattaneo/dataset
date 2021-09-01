import { getComputed } from '../../../modules/html/html';
import { API, ROUTES_PATH } from '../../../constants';

export default async function () {
    const { frame, page, thread } = this;
    const { store, router } = this.sharedContext;

    const onSubmit = async event => {
        event.preventDefault();
        event.stopPropagation();
        switch (event.target.pageIndex.value) {
        case '0':
            await thread.main('form/validate', event.target, ['email']).subscribe();
            page.flow.iGoToPage();
            break;
        case '1':
            await thread.main('form/validate', event.target, ['password']).subscribe();
            const body = await thread.main('form/format', event.target).subscribe();
            await thread.main('fetch/post', API.ACCOUNT.LOGIN, body).subscribe()
                .then(() => {
                    page.flow.iGoToPage();
                    store.user.logged.set(true);
                    setTimeout(() => {
                        router.redirect(`${ROUTES_PATH}index`);
                    }, 2000)
                })
                .catch(errors => {
                    thread.main('form/server-error', event.target, errors)
                });
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
