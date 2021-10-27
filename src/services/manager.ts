// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
import Common from '@/types/common';
import Manager from '@/types/manager';
import { json } from 'express';

/**
 * 获取当前登录用户信息
 * @param options
 */
export async function getCurrentManager() {
  return request<Manager.CurrentUserResult>('/iiep-manage/manager/getCurrentManager', {
    method: 'GET',
  });
}

/**
 * 添加运营账号
 * @param params
 */
export async function addManager(data: Manager.SaveManagerRequest) {
  return request<Common.ResultCode>('/iiep-manage/manager/add', {
    method: 'POST',
    data,
  });
}

/**
 * 更新运营账号
 * @param data
 */
export async function updateManager(data: Manager.SaveManagerRequest) {
  return request<Common.ResultCode>('/iiep-manage/manager/update', {
    method: 'POST',
    data,
  });
}

/**
 * 删除运营账号
 * @param data
 */
export async function deleteManager(id: number) {
  return request<Common.ResultCode>('/iiep-manage/manager/delete', {
    method: 'POST',
    params: { id },
  });
}

/**
 * 重置密码
 * @param id
 */
export async function resetPassword(id: number) {
  return request<Common.ResultCode>('/iiep-manage/manager/resetPassword', {
    method: 'POST',
    params: { id },
  });
}

/**
 * 修改我的密码
 * @param params
 */
export async function updateMyNameAndPhone(data: { name?: string; phone?: string }) {
  return request<Common.ResultCode>('/iiep-manage/manager/updateMyNameAndPhone', {
    method: 'POST',
    data,
  });
}

/**
 * 修改我的密码
 * @param params
 */
export async function updateMyPassword(params: { oldPassword?: string; newPassword?: string }) {
  return request<Common.ResultCode>('/iiep-manage/manager/updateMyPassword', {
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
  return request('/iiep-manage/manager/pageQuery', {
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
