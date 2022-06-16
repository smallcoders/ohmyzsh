// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/**
 * 服务方案审核列表
 * @param data
 * @returns
 */
export async function getProgrammeVerifyPage(data?: { [key: string]: any }) {
  return request<any>('/antelope-manage/solution/pageCheckQuery', {
    method: 'post',
    data,
  });
}

/**
 * 查询方案详情
 */
export async function getProgrammeVerifyDetail(id: string) {
  return request<any>(`/antelope-manage/solution/getDetail?id=${id}`);
}

