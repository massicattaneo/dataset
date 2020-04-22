import style from './language.css';
import template from './language.html';
import { pluginBundle } from '../../modules/bundle';

const options = {
    route: 'routes/settings/language',
    template,
    style
};

pluginBundle(options, async function ({ frame }) {

});
