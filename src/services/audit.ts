// @ts-ignore
/* eslint-disable */
import Common from '@/types/common.d';
import { request } from 'umi';

/** 获取审核列表 */
export async function httpGetAuditList(options?: { [key: string]: any }) {
  const key2 = 'rpc-tag'
  return request<Common.ResultCode & { result: any[] }>('/antelope-manage/audit/query', {
    method: 'GET',
    params: { ...(options || {}) },
    headers: {[key2]: 'yushen'}
  });
}

/**
 * 修改
 */
export async function handleAudit(data?: { [key: string]: any }) {
  return request<Common.ResultCode>('/antelope-manage/audit/handleAudit', {
    method: 'put',
    data,
  });
}

/**
 * 服务专员审核
 */
export async function handleAuditCommissioner(data?: { [key: string]: any }) {
  return request<Common.ResultCode>('/antelope-manage/audit/handleAuditCommissioner', {
    method: 'put',
    data,
  });
}
