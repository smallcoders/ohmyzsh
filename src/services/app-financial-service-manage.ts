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
 * 贷款产品（贷款和租赁）下拉框，返回产品id和产品名称，支持模糊搜索
 */
export async function addOrUpdateAudit(data?: Record<string, any>) {
  return request<any>(`/antelope-finance/app/addOrUpdateAudit`, {
    method: 'post',
    data,
  });
}
