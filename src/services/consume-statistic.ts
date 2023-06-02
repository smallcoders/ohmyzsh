// @ts-ignore
/* eslint-disable */
import LogoutVerify from '@/types/user-config-logout-verify';
import { request } from 'umi';

/**
 * 分页查询用户注销审核记录
 * @param data
 * @returns
 */
export async function getLogoutPage(data?: { [key: string]: any }) {
  return request<LogoutVerify.ResultList>('/antelope-trade/mng/vou/data/list', {
    method: 'post',
    data,
  });
}


