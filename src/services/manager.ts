// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/**
 * 获取登录ticket
 * @param options
 */
export async function getCurrentManager() {
  return request('/iiep-manage/manager/getCurrentManager', {
    method: 'GET',
  });
}
