export const loadImage = resource => {
    const image = new Image();
    const start = Date.now();
    return new Promise((resolve, reject) => {
        image.onload = () => {
            resolve({
                stats: { start, end: Date.now(), resource },
                resource: simpleObjectExtend({ data: image }, resource)
            });
        };
        image.onerror = () => reject({ message: 'ERROR LOADING IMAGE', resource });
        image.crossOrigin = 'anonymous';
        image.src = resource.url;
    });
};
