// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
import Login from '@/types/login';
import Common from '@/types/common';

/**
 * 获取登录ticket
 * @param options
 */
export async function getTicket(params: { loginNameOrPhone: string; password: string }) {
  return request('/iiep-manage/uap/getTicket', {
    method: 'GET',
    params: params,
  });
}

/**
 * 登录
 * @param options
 */
export async function login(params: Login.LoginParam) {
  return request<Common.ResultCode>('/iiep-manage/uap/login', {
    method: 'GET',
    params: params,
  });
}

/**
 * 退出
 */
export async function logout() {
  return request<Common.ResultCode>('/iiep-manage/uap/logout', {
    method: 'GET',
  });
}
