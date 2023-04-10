// 大写字母、小写字母、数字、特殊字符至少含三种
export const pwdVerifyReg = /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z!@#%^&*\-_[\],;=?]+$)(?![a-z0-9]+$)(?![a-z!@#%^&*\-_[\],;=?]+$)(?![0-9!@#%^&*\-_[\],;=?]+$)[\da-zA-Z!@#%^&*\-_[\],;=?]{8,20}$/

// 字母、数字、特殊字符至少含两种
// export const pwdVerifyReg = /^(?![a-z]+$)(?![A-Z]+$)(?![\d]+$)(?![!@#$%^&*_=[\];'",?-]+$)[\da-zA-Z!@#$%^&*_=[\];'",?-]{6,20}$/
// 手机号
export const phoneVerifyReg = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
// 座机（支持3-4位区号，7-8位直播号码，1-4位分机号，可用-或一个空格分隔）
export const telVerifyReg = /^((\d{7,8})|(\d{3,4})(-|\s)(\d{7,8})|(\d{3,4})(-|\s)(\d{7,8})(-|\s)(\d{1,4})|(\d{7,8})(-|\s)(\d{1,4}))$/
// 联系电话（手机或座机）
export const telOrPhoneVerifyReg = /^((13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])(\d{8})|(\d{7,8})|(\d{3,4})(-|\s)(\d{7,8})|(\d{3,4})(-|\s)(\d{7,8})(-|\s)(\d{1,4})|(\d{7,8})(-|\s)(\d{1,4}))$/
// 自然数(含0)
export const naturalNumberVerifyReg = /^([1-9]\d*|0)$/
// 不超过一亿的小数(可精确到小数点后两位)
export const decimalsVerifyReg = /^(([1-9]{1}\d{0,7})|(0{1}))(\.\d{1,2})?$/
// 统一社会信用代码(18位数字与除 I、O、Z、S、V外的大写字母组合 或 非0开头的15位数字)
export const creditCodeVerifyReg = /^([0-9A-HJ-NPQRTUWXY]{18}|[1-9]\d{14})$/
// 用户名规则：数字/字母/中文/下划线/中划线
export const loginNameVerifyReg = /^[\u4E00-\u9FA5A-Za-z0-9_-]+$/

// 数字三位一组正则替换
export const threeNumberSplit = (num: number | string) =>
  num?.toString().replace(/(\d+?)(?=(?:\d{3})+$)/g, '$1,')

// 号码隐藏
export const phoneHide = (phone: string | number) =>
  phone?.toString().replace(/(.{3})(.*)(.{3})/, '$1*****$3')

// 网址正则
export const urlReg = /^(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-.,@?^=%&:/~+#]*[\w\-@?^=%&/~+#])?/

// 字母数字小数点
export const patentReg = /^[A-Za-z0-9.]+$/

// 字母数字小数点
export const phoneReg = /^[0-9+-]+$/

export const idCardReg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/

// 密码,密码类型至少包含以下3种
// eslint-disable-next-line
export const pwdReg = /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W,./;'[]\`-=<>?:"{}|~!@#$%^&*()_+，。；‘【】、·《》？：“！￥（）—=]+$)(?![a-z0-9]+$)(?![a-z\W_!@#$%^&*`~()-+=]+$)(?![0-9\W_!@#$%^&*`~()-+=]+$)[a-zA-Z0-9\W_!@#$%^&*`~()-+=]{8,20}$/

//邮箱
export const emailReg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/

//邮编
export const postcodeReg = /^[1-9]\d{5}$/
