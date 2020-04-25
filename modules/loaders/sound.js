const loadSound = ({ url, name }) =>
    new Promise((resolve, reject) => {
        var audio = new Audio();
        audio.src = url;
        audio.preload = 'auto';
        audio.setAttribute('data-name', name);
        audio.addEventListener('canplaythrough', () => resolve(audio));
        audio.addEventListener('error', reject);
    });

module.exports = {
    loadSound
};
