import { request } from '@@/plugin-request/request';

/** 获取 驾驶舱信息 */
export async function getCockPit(data?: { [key: string]: any }) {
  return request<any>('/antelope-finance/mng/cockpit/query', {
    method: 'post',
    data,
  });
}

/** 获取 分润金额 */
export async function getShareProfit() {
  return request<any>('/antelope-finance/mng/cockpit/getShareProfit', {
    method: 'get',
  });
}
