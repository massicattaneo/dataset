import { Node } from '../../../modules/html/html';

export default async function (options, selector = '#app') {
    const { dialog, wizard } = this.home;
    dialog.show(wizard);
    document.querySelector(selector).appendChild(dialog);
    const res = await wizard.start(options);
    dialog.close();
    return res;
}
