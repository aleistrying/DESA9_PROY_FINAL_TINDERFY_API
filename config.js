const fs = require("fs")
const crypto = require("crypto")
const {
    PORT,
    PRODUCTION,

    DEV_MONGODB_USER,
    DEV_MONGODB_PASSWORD,
    DEV_MONGODB_DB,
    DEV_MONGODB_HOST,
    DEV_MONGODB_PORT,

    PROD_MONGODB_USER,
    PROD_MONGODB_PASSWORD,
    PROD_MONGODB_DB,
    PROD_MONGODB_HOST,
    PROD_MONGODB_PORT,


    PAGUELOFACIL_CCLW,
    PAGUELOFACIL_TOKEN,
    PAGUELOFACIL_PROD_URL,
    PAGUELOFACIL_DEV_URL,
    SUPER_SECRET,
} = process.env

const isProduction = PRODUCTION === "true"
let PUB_RSA_KEY, PRI_RSA_KEY;
//RSA
try {
    PRI_RSA_KEY = crypto.createPrivateKey({
        key: fs.readFileSync('./private.rsa.key', 'utf8'),
        format: "pem",
        passphrase: SUPER_SECRET
    })
    PUB_RSA_KEY = crypto.createPublicKey({
        key: fs.readFileSync('./public.rsa.key', 'utf8'),
        format: "pem",
        passphrase: SUPER_SECRET
    })
} catch (e) {
    console.log("No keys found.")
    // console.log(e)
}
if (!PUB_RSA_KEY || !PRI_RSA_KEY) {
    console.time("\x1b[31mGenerating keys 2...\x1b[0m")
    const { publicKey,
        privateKey } = crypto.generateKeyPairSync('rsa', {
            modulusLength: 4096,
            publicKeyEncoding: {
                type: "spki",
                format: 'pem'
            },
            privateKeyEncoding: {
                type: "pkcs8",
                format: 'pem',
                cipher: 'aes-256-cbc',
                passphrase: SUPER_SECRET
            }
        });

    PRI_RSA_KEY = crypto.createPrivateKey({
        key: privateKey,
        format: "pem",
        passphrase: SUPER_SECRET
    })
    PUB_RSA_KEY = crypto.createPublicKey({
        key: publicKey,
        format: "pem",
        passphrase: SUPER_SECRET
    })

    fs.writeFileSync('./private.rsa.key', privateKey)
    fs.writeFileSync('./public.rsa.key', publicKey)

    console.timeEnd("\x1b[31mGenerating keys 2...\x1b[0m")
}
//generate public and private keys if they dont' exist
let PRIVATE_KEY, PUBLIC_KEY;

console.time("Loaded Keys")
try {
    PRIVATE_KEY = crypto.createPrivateKey({
        key: fs.readFileSync('./private.key', 'utf8'),
        format: "pem",
        passphrase: SUPER_SECRET
    })
    PUBLIC_KEY = crypto.createPublicKey({
        key: fs.readFileSync('./public.key', 'utf8'),
        format: "pem",
        passphrase: SUPER_SECRET
    })
} catch (e) {
    console.log("No keys found.")
    // console.log(e)
}
if (!PRIVATE_KEY || !PUBLIC_KEY) {
    console.time("\x1b[31mGenerating keys 2...\x1b[0m")
    const { publicKey,
        privateKey } = crypto.generateKeyPairSync('ed25519', {
            modulusLength: 4096,
            publicKeyEncoding: {
                type: "spki",
                format: 'pem'
            },
            privateKeyEncoding: {
                type: "pkcs8",
                format: 'pem',
                cipher: 'aes-256-cbc',
                passphrase: SUPER_SECRET
            }
        });

    PRIVATE_KEY = crypto.createPrivateKey({
        key: privateKey,
        format: "pem",
        passphrase: SUPER_SECRET
    })
    PUBLIC_KEY = crypto.createPublicKey({
        key: publicKey,
        format: "pem",
        passphrase: SUPER_SECRET
    })

    fs.writeFileSync('./private.key', privateKey)
    fs.writeFileSync('./public.key', publicKey)

    console.timeEnd("\x1b[31mGenerating keys 2...\x1b[0m")
}
console.timeEnd("Loaded Keys")


module.exports = {
    PORT: Number(PORT),
    URL: isProduction ? "https://api.tinderfy.com" : "http://localhost:5000",
    FRONTEND_URL: isProduction ? "https://www.tinderfy.com" : "http://localhost:3000",

    MONGODB_USER: isProduction ? PROD_MONGODB_USER : DEV_MONGODB_USER,
    MONGODB_PASSWORD: isProduction ? PROD_MONGODB_PASSWORD : DEV_MONGODB_PASSWORD,
    MONGODB_DB: isProduction ? PROD_MONGODB_DB : DEV_MONGODB_DB,
    MONGODB_HOST: isProduction ? PROD_MONGODB_HOST : DEV_MONGODB_HOST,
    MONGODB_PORT: isProduction ? PROD_MONGODB_PORT : DEV_MONGODB_PORT,

    PUBLIC_KEY,
    PRIVATE_KEY,

    PUB_RSA_KEY,
    PRI_RSA_KEY,

    PAGUELOFACIL_CCLW,
    PAGUELOFACIL_TOKEN,
    PAGUELOFACIL_URL: isProduction ? PAGUELOFACIL_PROD_URL : PAGUELOFACIL_DEV_URL,

    JWT_ISSUER: "Tinderfy",
}