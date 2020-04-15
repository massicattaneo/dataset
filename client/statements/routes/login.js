import { WIZARD } from '../../components/wizard/script';

export default async function () {
    const list = [
        { type: WIZARD.TYPES.EMAIL, placeholder: 'Enter you email address', name: 'email' }
    ];
    const result = await this.thread.main('dialog/wizard', { list, title: 'SIGN IN' }).subscribe();
    console.warn(result);
}
