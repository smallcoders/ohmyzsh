// @ts-ignore
/* eslint-disable */
import Common from '@/types/common';
import LogoutVerify from '@/types/user-config-logout-verify';
import { request } from 'umi';

/**
 * 分页查询用户注销审核记录
 * @param data
 * @returns
 */
export async function getLogoutPage(data?: { [key: string]: any }) {
  return request<LogoutVerify.ResultList>('/iiep-manage/user/audit/userDeleteAuditPage', {
    method: 'post',
    data,
  });
}

/**
 * 用户注销申请审核通过
 */
export async function confirmUserDelete(id: string) {
  return request<Common.ResultCode>(`/iiep-manage/user/audit/confirmUserDelete?id=${id}`);
}
