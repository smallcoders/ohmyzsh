import { request } from 'umi';
import type AppFinancialMng from '@/types/app-financial-service-manage';

/**
 * 列表
 */
export async function getAuditInfoMngList() {
  return request<AppFinancialMng.ResultList>('/antelope-finance/app/mng/getAuditInfoMng', {
    method: 'get',
  });
}
/**
 * 新增修改审核信息
 */
export async function addOrUpdateAudit(data?: Record<string, any>) {
  return request<any>(`/antelope-finance/app/mng/addOrUpdateAudit`, {
    method: 'post',
    data,
  });
}
