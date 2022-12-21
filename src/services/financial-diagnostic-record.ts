import { request } from 'umi';
import type DiagnosticRecord from '@/types/financial-diagnostic-record';

/**
 * 列表
 */
export async function getDiagnoseRecordList(data?: Record<string, any>) {
  return request<DiagnosticRecord.ResultList>('/antelope-finance/diagnose/mng/queryDiagnose', {
    method: 'post',
    data,
  });
}
/**
 * 贷款产品（贷款和租赁）下拉框，返回产品id和产品名称，支持模糊搜索
 */
export async function getLoanProList(data?: Record<string, any>) {
  return request<any>(`/antelope-finance/diagnose/queryLoanProList`, {
    method: 'post',
    data,
  });
}
/**
 * 录入客户贷款需求
 */
export async function addCustomerDemand(data?: Record<string, any>) {
  return request<any>('/antelope-finance/diagnose/mng/addCustomerDemand', {
    method: 'post',
    data,
  });
}
/**
 * 查询客户贷款需求
 * @param params
 */
export async function queryCustomerDemand(diagnoseId: number) {
  return request<DiagnosticRecord.CustomerDemandObj>(
    `/antelope-finance/diagnose/mng/queryCustomerDemand?diagnoseId=${diagnoseId}`,
    {
      method: 'post',
    },
  );
}

/**
 * 诊断详情查询
 * @param params
 */
export async function queryDiagnoseDetail(id: number) {
  return request<DiagnosticRecord.DiagnoseDetailData>(
    `/antelope-finance/diagnose/mng/queryDiagnoseDetail?id=${id}`,
    {
      method: 'get',
    },
  );
}