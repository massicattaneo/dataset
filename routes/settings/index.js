import { pluginBundle } from '../../modules/bundle';
import style from './index.css';
import template from './index.html';

const options = {
    route: 'routes/settings/index',
    template,
    style
};

pluginBundle(options, async function () {
    const { frame } = this;
    const { store } = this.sharedContext;
});
    