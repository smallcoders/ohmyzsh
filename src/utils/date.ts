/**
 * 日期格式化
 * @param Number time 时间戳
 * @param String format 格式
 */
export const dateFormat = (time: string | undefined, format = 'Y-m-d h:i:s') => {
  if (!time) return '';
  const t = new Date(time);
  // 日期格式
  const year = t.getFullYear();
  // 由于 getMonth 返回值会比正常月份小 1
  const month = t.getMonth() + 1;
  const day = t.getDate();
  const hours = t.getHours();
  const minutes = t.getMinutes();
  const seconds = t.getSeconds();

  const hash = {
    y: year,
    m: month,
    d: day,
    h: hours,
    i: minutes,
    s: seconds,
  };
  // 是否补 0
  return format.replace(/\w/g, (o) => {
    const rt = hash[o.toLocaleLowerCase()];
    return rt > 10 ? rt : `0${rt}`;
  });
};
