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
} = process.env

const isProduction = PRODUCTION === "true"
//generate public and private keys if they dont' exist

let PRIVATE_KEY, PUBLIC_KEY;

console.time("Loaded Keys")
try {
    PRIVATE_KEY = fs.readFileSync('./private.key', 'utf8')
    PUBLIC_KEY = fs.readFileSync('./public.key', 'utf8')
} catch (e) {
    console.log("No keys found.")
    // console.log(e)
}
if (!PRIVATE_KEY || !PUBLIC_KEY) {
    console.time("\x1b[31mGenerating keys...\x1b[0m")
    const { publicKey,
        privateKey } = crypto.generateKeyPairSync('rsa', {
            modulusLength: 4096,
            publicKeyEncoding: {
                type: 'pkcs1',
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs1',
                format: 'pem',
                cipher: 'aes-256-cbc',
                passphrase: ''
            }
        });

    PRIVATE_KEY = privateKey
    PUBLIC_KEY = publicKey

    fs.writeFileSync('./private.key', PRIVATE_KEY)
    fs.writeFileSync('./public.key', PUBLIC_KEY)

    console.timeEnd("\x1b[31mGenerating keys...\x1b[0m")
}
console.timeEnd("Loaded Keys")


module.exports = {
    PORT: Number(PORT),
    MONGODB_USER: isProduction ? PROD_MONGODB_USER : DEV_MONGODB_USER,
    MONGODB_PASSWORD: isProduction ? PROD_MONGODB_PASSWORD : DEV_MONGODB_PASSWORD,
    MONGODB_DB: isProduction ? PROD_MONGODB_DB : DEV_MONGODB_DB,
    MONGODB_HOST: isProduction ? PROD_MONGODB_HOST : DEV_MONGODB_HOST,
    MONGODB_PORT: isProduction ? PROD_MONGODB_PORT : DEV_MONGODB_PORT,

    PUBLIC_KEY,
    PRIVATE_KEY,

    PAGUELOFACIL_CCLW,
    PAGUELOFACIL_TOKEN,
    PAGUELOFACIL_URL: isProduction ? PAGUELOFACIL_PROD_URL : PAGUELOFACIL_DEV_URL,
}