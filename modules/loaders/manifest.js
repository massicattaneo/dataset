import { loadCss } from './css';
import { loadFont } from './font';

const options = { extraChars: '&#xe803;' };

export const manifest = array => {
    const loaders = array.map((file) => {
        if (file.url.endsWith('.css')) return () => loadCss(file);
        if (file.url.endsWith('.ttf')) return () => loadFont(file, options);
    });
    return Promise.all(loaders.map(loader => {
        return loader.retry().subscribe();
    }));
};
