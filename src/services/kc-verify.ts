// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/**
 * 获取科创成果列表
 * @param data
 * @returns
 */
export async function getCreativePage(data?: { [key: string]: any }) {
  return request<any>('/iiep-manage/creative/audit/page', {
    method: 'post',
    data,
  });
}

/**
 * 查询成果详情
 */
export async function getCreativeDetail(id: string) {
  return request<any>(`/iiep-manage/creative/audit/detail?id=${id}`);
}

/**
 * 处理审核
 */
export async function updateCreativeAudit(data?: { [key: string]: any }) {
  return request<any>('/iiep-manage/creative/audit/handleAudit', {
    method: 'put',
    data,
  });
}
