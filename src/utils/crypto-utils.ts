import crypto from 'crypto'
const CryptoJS = require("crypto-js")
import { customAlphabet } from 'nanoid'

export function encryptPwd(pwd: any, secret: any) {
    return crypto.createHmac("sha256", secret).update(pwd).digest("hex");
}

export function newRandomPwd(length: number) {
    const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', length)
    return nanoid();
}

export const encrypt = (data: string, secret: string) => {
    var cipherKey = CryptoJS.AES.encrypt(data, secret).toString();
    return cipherKey
}

export const decrypt = (data: any, secret: string) => {
    var bytes = CryptoJS.AES.decrypt(data, secret);
    var privateKey = bytes.toString(CryptoJS.enc.Utf8);
    return privateKey;
}
