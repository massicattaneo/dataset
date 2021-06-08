const crypto = require('crypto');
const fs = require('fs');
const getPrivatePath = filename => `${__dirname}/../private/${filename}`;
const { secretKey } = require(getPrivatePath('passwords'));
const iv = Buffer.alloc(16, 0);
const algorithm = 'aes-192-cbc';
const key = crypto.scryptSync(secretKey, 'salt', 24);

const generatePublicPrivateKey = () => {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 512,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem',
            cipher: 'aes-256-cbc',
            passphrase: secretKey
        }
    });
    fs.writeFileSync(getPrivatePath('private.key'), privateKey, 'UTF8');
    fs.writeFileSync(getPrivatePath('public.key'), publicKey, 'UTF8');
};

if (!fs.existsSync(getPrivatePath('private.key'))) {
    generatePublicPrivateKey();
}

const privateKey = fs.readFileSync(getPrivatePath('private.key'), 'UTF8');
const publicKey = fs.readFileSync(getPrivatePath('public.key'), 'UTF8');

const encrypt = data => {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    const encrypted = cipher.update(data.toString(), 'utf8', 'hex');
    return `${encrypted}${cipher.final('hex')}`;
};
const decrypt = data => {
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    const decrypted = decipher.update(data, 'hex', 'utf8');
    return `${decrypted}${decipher.final('utf8')}`;
};

const createSignature = data => {
    const sign = crypto.createSign('md5');
    sign.write(data.toString());
    sign.end();
    return sign.sign({ key: privateKey, passphrase: secretKey }, 'hex');
};

const verifySignature = (signature, data) => {
    const verify = crypto.createVerify('md5');
    verify.write(data.toString());
    verify.end();
    return verify.verify(publicKey, signature, 'hex');
};

module.exports = {
    encrypt,
    decrypt,
    createSignature,
    verifySignature
};
