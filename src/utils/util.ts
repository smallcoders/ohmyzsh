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
