import { pluginBundle } from '../../modules/bundle';
pluginBundle('routes/settings/language', async function ({ frame }) {
    const { store } = this;
    frame.iPosition({ width: 330, height: 200 });
});
