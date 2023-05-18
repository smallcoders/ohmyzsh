import Common from '@/types/common';
import { request } from 'umi';

/**
 * 获取地区级联列表
 */
export async function getAreaCode(params?: any) {
  return request<Common.ResultCode>('/antelope-common/common/area/areaCode/cascade', {
    method: 'get',
    params,
  });
}
