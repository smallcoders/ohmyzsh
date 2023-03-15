import type FinancialInstitution from '@/types/financial-institution';
import { request } from 'umi';

/** 机构列表 */
export async function getBankTree() {
  return request<FinancialInstitution.ResultList>('/antelope-finance/bank/mng/queryBank', {
    method: 'get',
  });
}

/** 机构详情 */
export async function getBankInfo(id: number) {
  return request<FinancialInstitution.ResultBankInfo>(
    `/antelope-finance/bank/mng/getBankById?id=${id}`,
    {
      method: 'get',
    },
  );
}

/** 一级二级机构列表 */
export async function getQueryBank2() {
  return request<FinancialInstitution.ResultBankInfo>('/antelope-finance/bank/mng/queryBank2', {
    method: 'get',
  });
}

/** 新增编辑 */
export async function saveOrUpdateInstitution(data?: Record<string, any>) {
  return request<FinancialInstitution.ResultsaveOrUpdate>('/antelope-finance/bank/mng/addBank', {
    method: 'post',
    data,
  });
}

/**
 * 删除
 * @param params
 */
export async function removeBank(id: number) {
  return request<any>(`/antelope-finance/bank/mng/delBank?id=${id}`, {
    method: 'get',
  });
}

/**
 * 门户合作机构查询
 * @param params
 */
export async function queryCooperateOrg() {
  return request<any>(`/antelope-finance/bank/queryCooperateOrg`, {
    method: 'get',
  });
}
