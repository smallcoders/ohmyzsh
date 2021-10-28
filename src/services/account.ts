// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
import Common from '@/types/common';
import Account from '@/types/account';

/**
 * 获取当前登录用户信息
 * @param options
 */
export async function getCurrentUser() {
  return request<Account.CurrentUserResult>('/iiep-manage/uap/getCurrentUser', {
    method: 'GET',
  });
}

/**
 * 添加运营账号
 * @param params
 */
export async function addAccount(data: Account.SaveAccountRequest) {
  return request<Common.ResultCode>('/iiep-manage/account/add', {
    method: 'POST',
    data,
  });
}

/**
 * 更新运营账号
 * @param data
 */
export async function updateAccount(data: Account.SaveAccountRequest) {
  return request<Common.ResultCode>('/iiep-manage/account/update', {
    method: 'POST',
    data,
  });
}

/**
 * 删除运营账号
 * @param data
 */
export async function deleteAccount(id: number) {
  return request<Common.ResultCode>('/iiep-manage/account/delete', {
    method: 'POST',
    params: { id },
  });
}

/**
 * 重置密码
 * @param id
 */
export async function resetPassword(id: number) {
  return request<Common.ResultCode>('/iiep-manage/account/resetPassword', {
    method: 'POST',
    params: { id },
  });
}

/**
 * 修改我的密码
 * @param params
 */
export async function updateMyNameAndPhone(data: { name?: string; phone?: string }) {
  return request<Common.ResultCode>('/iiep-manage/account/updateMyNameAndPhone', {
    method: 'POST',
    data,
  });
}

/**
 * 修改我的密码
 * @param params
 */
export async function updateMyPassword(params: { oldPassword?: string; newPassword?: string }) {
  return request<Common.ResultCode>('/iiep-manage/account/updateMyPassword', {
    method: 'POST',
    params,
  });
}

/**
 * 分页查询
 * @param params
 */
export async function pageQuery(params: {
  current?: number;
  pageSize?: number;
  loginName?: string;
  name?: string;
  phone?: string;
}) {
  return request('/iiep-manage/account/pageQuery', {
    method: 'POST',
    params: { ...params, pageIndex: params.current },
  }).then((json) => ({
    success: json.code === 0,
    total: json.totalCount,
    data: json.result,
  }));
}

/**
 * 获取uap默认密码
 */
export async function getUapDefaultPwd() {
  return request('/iiep-manage/uap/getUapDefaultPwd', {
    method: 'GET',
  });
}
