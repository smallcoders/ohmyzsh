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
// 强制保留2位小数，如：2，会在2后面补上00.即2.00
export const toDecimal2 = (x: any | number) => {
  let f = parseFloat(x);
  if (isNaN(f)) {
    return false;
  }
  f = Math.round(x * 100) / 100;
  let s = f.toString();
  let rs = s.indexOf('.');
  if (rs < 0) {
    rs = s.length;
    s += '.';
  }
  while (s.length <= rs + 2) {
    s += '0';
  }
  return s;
};
// 元转分 yuan:要转换的钱，单位元； digit：转换倍数默认万元（10000）
export function regYuanToFen(yuan: number, digit: number = 1000000): any {
  if (yuan === undefined) return null;
  let m = 0;
  const s1 = yuan.toString(),
    s2 = digit.toString();
  try {
    m += s1.split('.')[1].length;
  } catch (e) {}
  try {
    m += s2.split('.')[1].length;
  } catch (e) {}
  return (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) / Math.pow(10, m);
}
// 分转元
export function regFenToYuan(fen: any | number, digit: number = 10000): any {
  let num = fen;
  num = fen * 0.01 * (1 / digit);
  num += '';
  const reg = num.indexOf('.') > -1 ? /(\d{1,3})(?=(?:\d{3})+\.)/g : /(\d{1,3})(?=(?:\d{3})+$)/g;
  num = num.replace(reg, '$1');
  num = customToFixed(num);
  return num;
}
// 金额转为大写汉字
export function priceUppercase(money: any) {
  const cnNums = new Array('零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'); //汉字的数字
  const cnIntRadice = new Array('', '拾', '佰', '仟'); //基本单位
  const cnIntUnits = new Array('', '万', '亿', '兆'); //对应整数部分扩展单位
  const cnDecUnits = new Array('角', '分', '毫', '厘'); //对应小数部分单位
  //var cnInteger = "整"; //整数金额时后面跟的字符
  let cnIntLast = '元'; //整型完以后的单位
  const maxNum = 999999999999999.9999; //最大处理的数字

  let IntegerNum; //金额整数部分
  let DecimalNum; //金额小数部分
  let ChineseStr = ''; //输出的中文金额字符串
  let parts; //分离金额后用的数组，预定义
  if (!money) {
    return '';
  }
  money = parseFloat(money);
  if (money >= maxNum) {
    console.log('超出最大处理数字');
    // $.alert('超出最大处理数字');
    return '';
  }
  if (money == 0) {
    //ChineseStr = cnNums[0]+cnIntLast+cnInteger;
    ChineseStr = cnNums[0] + cnIntLast;
    //document.getElementById("show").value=ChineseStr;
    return ChineseStr;
  }
  money = money.toString(); //转换为字符串
  if (money.indexOf('.') == -1) {
    IntegerNum = money;
    DecimalNum = '';
    cnIntLast = '元整';
  } else {
    parts = money.split('.');
    IntegerNum = parts[0];
    DecimalNum = parts[1].substr(0, 4);
  }
  let zeroCount = 0;
  let IntLen = 0;
  let n;
  let p;
  let m;
  let q;
  let decLen = 0;
  if (parseInt(IntegerNum, 10) > 0) {
    //获取整型部分转换
    zeroCount = 0;
    IntLen = IntegerNum.length;
    for (let i = 0; i < IntLen; i++) {
      n = IntegerNum.substr(i, 1);
      p = IntLen - i - 1;
      q = p / 4;
      m = p % 4;
      if (n == '0') {
        zeroCount++;
      } else {
        if (zeroCount > 0) {
          ChineseStr += cnNums[0];
        }
        zeroCount = 0; //归零
        ChineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
      }
      if (m == 0 && zeroCount < 4) {
        ChineseStr += cnIntUnits[q];
      }
    }
    ChineseStr += cnIntLast;
    //整型部分处理完毕
  }
  if (DecimalNum != '') {
    //小数部分
    decLen = DecimalNum.length;
    for (let i = 0; i < decLen; i++) {
      n = DecimalNum.substr(i, 1);
      if (n != '0') {
        ChineseStr += cnNums[Number(n)] + cnDecUnits[i];
      }
    }
  }
  if (ChineseStr == '') {
    //ChineseStr += cnNums[0]+cnIntLast+cnInteger;
    ChineseStr += cnNums[0] + cnIntLast;
  } /* else if( DecimalNum == '' ){
            ChineseStr += cnInteger;
            ChineseStr += cnInteger;
        } */
  return ChineseStr;
}

// 默认保留两位小数 不进行四舍五入
export const customToFixed = (num: string, len = 2) => {
  if (typeof num === 'undefined') {
    return num;
  }
  if (num === null) {
    return num;
  }
  let newNum = num.toString();
  const index = newNum.indexOf('.');
  if (index !== -1) {
    newNum = newNum.substring(0, index + 1 + len);
  } else {
    newNum = newNum.substring(0);
  }
  return parseFloat(newNum).toFixed(len);
};

/**
 * 是否转换显示
 * @param val
 * @param prefix
 * @returns
 */
export const jsonTransform = (val: any, prefix = '/') => {
  try {
    return JSON.parse(val || JSON.stringify([prefix])).join('、')
  } catch (error) {
    return val
  }
}

//数值转千分位，可保留小数
export const formatPrice = (num: string) => {
  let newVal = num.replace(/[^\d|\.]/g, '')
  if (newVal.length > 1 && newVal[0] === '0' && newVal[1] !== '.'){
    newVal = newVal.slice(1)
  }
  const hasDot = /\./.test(newVal)
  const newValArr = newVal.split('.')
  const newVal0 = newValArr[0] ? newValArr[0]
    .split('')
    .reverse()
    .reduce((prev, next, index) => {
      return (index % 3 ? next : `${next},`) + prev
    }, '') : '0'
  return (
    newVal0.substring(0, newVal0.length - 1) +
    (hasDot ? '.' : '') +
    (newValArr[1] ? newValArr[1] : '')
  )
}

