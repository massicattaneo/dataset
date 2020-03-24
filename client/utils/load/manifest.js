import { loadCss } from '../../utils/load/css';
import { loadFont } from '../../utils/load/font';

const options = { extraChars: '&#xe803;' };

export const manifest = array => Promise.all(array.map((file) => {
    if (file.url.endsWith('.css')) return loadCss(file);
    if (file.url.endsWith('.ttf')) return loadFont(file, options);
}));
