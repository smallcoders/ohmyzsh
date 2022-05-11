// @ts-ignore
/* eslint-disable */
import Common from '@/types/common.d';
import Banner from '@/types/service-config-banner';
import { request } from 'umi';

/** 获取banner 列表 */
export async function httpGetAuditList(options?: { [key: string]: any }) {
  return request<Common.ResultCode & { result: any[] }>('/iiep-manage/audit/query/list', {
    method: 'GET',
    params: { ...(options || {}) },
  });
}

/**
 * 修改
 */
export async function handleAudit(data?: { [key: string]: any }) {
  return request<Common.ResultCode>('/iiep-manage/audit/handleAudit', {
    method: 'put',
    data,
  });
}
