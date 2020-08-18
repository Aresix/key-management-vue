const CryptoJS = require('crypto-js')

const key = CryptoJS.enc.Utf8.parse('abcde123456edcba')
const iv = CryptoJS.enc.Utf8.parse('6543210abdef1115')

/**
 * 解密方法
 * @return {string}
 */
function Decrypt (context) {
  let decrypt = CryptoJS.AES.decrypt(context, key, {iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7})
  return decrypt.toString(CryptoJS.enc.Utf8)
}

/**
 * 加密方法
 * @return {string}
 */
function Encrypt (context) {
  let srcs = CryptoJS.enc.Utf8.parse(context)
  let encrypted = CryptoJS.AES.encrypt(srcs, key, {iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7})
  return encrypted.toString()
}

export default {
  Decrypt,
  Encrypt
}
