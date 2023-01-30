import { request } from 'umi';

/**
 * 人社礼包统计数据
 * @param dateType
 * @returns
 */
export async function getRSStatistic(dateType: string) {
  return request<any>(`/antelope-other/mng/hrss/statistic?dateType=${dateType}`, {
    method: 'get',
  });
}
