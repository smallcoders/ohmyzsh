import CryptoJS from 'crypto-js';

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
