import { message } from 'antd';
import CryptoJS from 'crypto-js';

const aesKey = CryptoJS.enc.Utf8.parse('lingyangplatformlingyangplatform');
const aesIv = CryptoJS.enc.Utf8.parse('lingyangplatform');

// base64加密
export function encryptWithBase64(text: string) {
  const encryptText = CryptoJS.enc.Utf8.parse(text);
  return CryptoJS.enc.Base64.stringify(encryptText);
}

export function decryptWithBase64(base64Text: string) {
  if (!base64Text) {
    return null;
  }
  const decryptText = CryptoJS.enc.Base64.parse(base64Text);
  try {
    decryptText.toString(CryptoJS.enc.Utf8);
  } catch (err) {
    console.warn(err);
  }
  return decryptText.toString(CryptoJS.enc.Utf8);
}

//Md5加密
export function encryptWithMd5(text: string) {
  return CryptoJS.MD5(text).toString().toUpperCase();
}

// AES 加密
export function encryptWithAES(password: string) {
  const pwd = CryptoJS.AES.encrypt(
    CryptoJS.enc.Utf8.parse(new Date().valueOf() + encryptWithBase64(password)),
    aesKey,
    {
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
      iv: aesIv,
    },
  );
  return encodeURIComponent(pwd.toString());
}

// AES 解密
export function decryptWithAES(text: string) {
  try {
    const pwd = CryptoJS.AES.decrypt(text, aesKey, {
      iv: aesIv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }).toString(CryptoJS.enc.Utf8);
    return decryptWithBase64(pwd.substring(13));
  } catch (error) {
    message.error('解码错误，格式不正确');
  }
}
