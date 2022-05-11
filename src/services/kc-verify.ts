// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/**
 * 获取科技成果列表
 * @param data
 * @returns
 */
export async function getCreativePage(data?: { [key: string]: any }) {
  return request<any>('/iiep-manage/creative/audit/page/achievement', {
    method: 'post',
    data,
  });
}

/**
 * 查询成果详情
 */
export async function getCreativeDetail(id: string) {
  return request<any>(`/iiep-manage/creative/audit/detail/achievement?id=${id}`);
}

/**
 * 处理成果审核
 */
export async function updateCreativeAudit(data?: { [key: string]: any }) {
  return request<any>('/iiep-manage/creative/audit/handleAudit/achievement', {
    method: 'put',
    data,
  });
}

/**
 * 查询成果详情
 */
export async function getDemandDetail(id: string) {
  return request<any>(`/iiep-manage/creative/audit/detail/demand?id=${id}`);
}

/**
 * 获取科创需求列表
 * @param data
 * @returns
 */
export async function getDemandPage(data?: { [key: string]: any }) {
  return request<any>('/iiep-manage/creative/audit/page/demand', {
    method: 'post',
    data,
  });
}

/**
 * 处理需求审核
 */
export async function updateDemandAudit(data?: { [key: string]: any }) {
  return request<any>('/iiep-manage/creative/audit/handleAudit/demand', {
    method: 'put',
    data,
  });
}
