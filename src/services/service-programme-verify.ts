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

// ------------------------消费券申领审核----------------------------
/**
 * 消费券申领审核列表
 * @param data
 * @returns
 */
 export async function getVoucherVerifyPage(data?: { [key: string]: any }) {
  return request<any>('/antelope-trade/vou/apply/mng/page', {
    method: 'post',
    data,
  });
}
/**
 * 查询审核详情
 */
export async function getVoucherVerifyDetail(id: string) {
  return request<any>(`/antelope-trade/vou/apply/mng/detail?applyId=${id}`);
}
/**
 * 消费券申领审核提交审核
 * @param data
 * @returns
 */
 export async function auditVoucherVerify(data?: { [key: string]: any }) {
  return request<any>('/antelope-trade/vou/apply/mng/audit', {
    method: 'post',
    data,
  });
}
