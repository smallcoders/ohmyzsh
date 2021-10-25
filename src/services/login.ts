// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
import { Login } from '../types/login';
/**
 * 获取登录ticket
 * @param options
 */
export async function getTicket(params: { loginName: string }) {
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
  return request<Login.Login>('/iiep-manage/uap/login', {
    method: 'GET',
    params: params,
  });
}

/**
 * 退出
 * @param options
 */
export async function logout() {
  return request('/iiep-manage/uap/logout', {
    method: 'GET',
  });
}
