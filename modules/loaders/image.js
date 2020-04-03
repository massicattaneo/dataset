const loadImage = ({ url }) => {
    const image = new Image();
    return new Promise((resolve, reject) => {
        image.onload = () => {
            resolve(image);
        };
        image.onerror = () => reject({ url });
        image.crossOrigin = 'anonymous';
        image.src = url;
    });
};

module.exports = {
    loadImage
};
