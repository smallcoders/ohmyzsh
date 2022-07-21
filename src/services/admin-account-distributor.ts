import type AdminAccountDistributor from '@/types/admin-account-distributor.d';
import Common from '@/types/common';
import { request } from 'umi';

/**
 * 查询账号列表
 * @returns
 */
export async function getAdminAccountPage(data?: { [key: string]: any }) {
  return request<AdminAccountDistributor.RecordList>(`/antelope-manage/creative/admin/page`, {
    method: 'post',
    data,
  });
}

/**
 * 新增管理员
 * @returns
 */
export async function addAdminAccount(data?: { [key: string]: any }) {
  return request<AdminAccountDistributor.RecordList>(`/antelope-manage/creative/admin/create`, {
    method: 'post',
    data,
  });
}

/**
 * 编辑
 * @returns
 */
export async function updateAdminAccount(data?: { [key: string]: any }) {
  return request<Common.ResultCode & { result: any }>(`/antelope-manage/creative/admin/update`, {
    method: 'put',
    data,
  });
}

/**
 * 删除
 * */
export async function removeAdminAccount(id: string) {
  return request<Common.ResultCode>(`/antelope-manage/creative/admin/delete?id=${id}`, {
    method: 'DELETE',
  });
}

/**
 * 重置密码
 * */
export async function resetAdminAccount(id: string) {
  return request<Common.ResultCode>(`/antelope-manage/creative/admin/reset?id=${id}`);
}
