// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/**
 * 分页查询用户注销审核记录
 * @param data
 * @returns
 */
export async function getLogoutPage(data?: { [key: string]: any }) {
  return request<any>('/iiep-manage/user/audit/userDeleteAuditPage', {
    method: 'post',
    data,
  });
}

/**
 * 用户注销申请审核通过
 */
export async function confirmUserDelete(id: string) {
  return request<any>(`/iiep-manage/user/audit/confirmUserDelete?id=${id}`);
}
