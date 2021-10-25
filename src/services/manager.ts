// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
import Manager from '@/types/manager';

/**
 * 获取登录ticket
 * @param options
 */
export async function getCurrentManager() {
  return request<Manager.CurrentUserResult>('/iiep-manage/manager/getCurrentManager', {
    method: 'GET',
  });
}
