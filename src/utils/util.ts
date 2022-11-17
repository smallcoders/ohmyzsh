/**
 * 将url和参数拼接成完整地址
 * @param {string} url url地址
 * @param {Json} data json对象
 * @returns {string}
 */
export const getUrl = (prefixUrl: string, params: any) => {
  /**
   * 传入对象返回url参数
   * @param {Object} data {a:1}
   * @returns {string}
   */
  const getParam = (data: any) => {
    let url = '';
    for (const k in data) {
      const value = data[k] !== undefined ? data[k] : '';
      url += `&${k}=${encodeURIComponent(value)}`;
    }
    return url ? url.substring(1) : '';
  };
  //看原始url地址中开头是否带?，然后拼接处理好的参数
  return prefixUrl + (prefixUrl.indexOf('?') < 0 ? '?' : '') + getParam(params);
};
// 两数相加
export function numadd(a: any, b: any | number): any {
  let c, d, e;
  try {
    c = a.toString().split('.')[1].length;
  } catch (f) {
    c = 0;
  }
  try {
    d = b.toString().split('.')[1].length;
  } catch (f) {
    d = 0;
  }
  return (e = Math.pow(10, Math.max(c, d))), (nummul(a, e) + nummul(b, e)) / e;
}

//两数相减
export function numsub(a: any, b: any | number): any {
  let c, d, e;
  try {
    c = a.toString().split('.')[1].length;
  } catch (f) {
    c = 0;
  }
  try {
    d = b.toString().split('.')[1].length;
  } catch (f) {
    d = 0;
  }
  return (e = Math.pow(10, Math.max(c, d))), (nummul(a, e) - nummul(b, e)) / e;
}

//两数相乘
export function nummul(a: any, b: any | number): any {
  let c = 0;
  const d = a.toString(),
    e = b.toString();
  try {
    c += d.split('.')[1].length;
  } catch (f) {}
  try {
    c += e.split('.')[1].length;
  } catch (f) {}
  return (Number(d.replace('.', '')) * Number(e.replace('.', ''))) / Math.pow(10, c);
}

//两数除
export function numdiv(a: any, b: any | number): any {
  let c,
    d,
    e = 0,
    f = 0;
  try {
    e = a.toString().split('.')[1].length;
  } catch (g) {}
  try {
    f = b.toString().split('.')[1].length;
  } catch (g) {}
  return (
    (c = Number(a.toString().replace('.', ''))),
    (d = Number(b.toString().replace('.', ''))),
    nummul(c / d, Math.pow(10, f - e))
  );
}


// 默认保留两位小数 不进行四舍五入
export const customToFixed = (num: string, len = 2) => {
  if (typeof num === 'undefined'){
    return num
  }
  if (num === null){
    return num
  }
  let newNum = num.toString()
  const index = newNum.indexOf('.')
  if (index !== -1) {
    newNum = newNum.substring(0, index + 1 + len)
  } else {
    newNum = newNum.substring(0)
  }
  return parseFloat(newNum).toFixed(len)
}
