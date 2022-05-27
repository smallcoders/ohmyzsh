// @ts-ignore
/* eslint-disable */
import CommissionerService from '@/types/commissioner-service.d';
import Common from '@/types/common';
import { request } from 'umi';

/**
 * 专员服务列表
 * @param options
 * @returns
 */
export async function getCommissionerServicePage(data?: { [key: string]: any }) {
  return request<CommissionerService.RecordList>('/iiep-manage/serviceRecord', {
    method: 'post',
    data,
  });
}

/**
 * 删除记录
 * */
export async function removeCommissionerService(id: string) {
  return request<Common.ResultCode>(`/iiep-manage/serviceRecord/delete/${id}`, {
    method: 'DELETE',
  });
}
