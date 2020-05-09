import { formToJSON, getComputed } from '../../../modules/html/html';
import { API } from '../../../constants';
import { fetchGetJSON, fetchPostJSON } from '../../../client/fetch-utils';

export default async function () {
    const { frame, page, thread } = this;
    const { store } = this.sharedContext;

    const onSubmit = async event => {
        event.preventDefault();
        event.stopPropagation();
        switch (event.target.pageIndex.value) {
        case '0':
            const serverValidation = `fetchGet|${API.ACCOUNT.EXISTS}?email=$1|exists|false|notifications/warn/email-exists`;
            await thread.main('validate', event.target.firstname, ['required']).subscribe();
            await thread.main('validate', event.target.surname, ['required']).subscribe();
            await thread.main('validate', event.target.email, ['required', 'email', serverValidation]).subscribe();
            await thread.main('validate', event.target.password, ['required', 'length|8']).subscribe();
            await thread.main('validate', event.target.terms, ['checked']).subscribe();
            await fetchPostJSON(API.ACCOUNT.REGISTER, formToJSON(event.target));
            page.flow.iGoToPage();
            break;
        case '1':

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
