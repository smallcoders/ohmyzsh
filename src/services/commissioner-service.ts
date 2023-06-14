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
  return request<CommissionerService.RecordList>('/antelope-manage/serviceRecord', {
    method: 'post',
    data,
  });
}

/**
 * 删除记录
 * */
export async function removeCommissionerService(id: string) {
  return request<Common.ResultCode>(`/antelope-manage/serviceRecord/delete/${id}`, {
    method: 'DELETE',
  });
}

// 生态服务商管理
/**
 * 企业规模人数枚举
 */
export async function getEnterpriseSizeList() {
  return request<any>(`/antelope-pay/enum/enterpriseSize/list`, {
    method: 'get',
  });
}

/**
 * 行业类型枚举
 */
export async function getIndustryList() {
  return request<any>(`/antelope-pay/enum/industry/list`, {
    method: 'get',
  });
}

/**
 * 服务商管理分页查询
 * @param options
 * @returns
 */
export async function getEcoProviderPage(params: {
  current?: number;
  pageSize?: number;
  [key: string]: any;
}) {
  return request('/antelope-pay/mng/ecoProvider/page', {
    method: 'POST',
    data: { 
      ...params, 
      pageIndex: params.current,
      startTime: params.time ? params.time[0] : '',
      endTime: params.time ? params.time[1] : ''
    },
  }).then((e: { code: number; totalCount: any; result: any }) => ({
    success: e.code === 0,
    total: e.totalCount,
    data: e.result,
  }));
}
