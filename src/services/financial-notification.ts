import { request } from 'umi';

/** 待办通知列表 */
export async function queryNotice() {
  return request<any>('/antelope-finance/notice/mng/query', {
    method: 'get',
  });
}

/** 更新 */
export async function upDateNotice(data?: Record<string, any>) {
  return request<any>('/antelope-finance/notice/mng/update', {
    method: 'post',
    data,
  });
}
