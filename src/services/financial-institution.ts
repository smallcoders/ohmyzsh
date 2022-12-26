import type FinancialInstitution from '@/types/financial-institution';
import { request } from 'umi';

/** 机构列表 */
export async function getBankTree() {
  return request<FinancialInstitution.ResultList>('/antelope-finance/bank/mng/queryBank', {
    method: 'get',
    headers: {
      'rpc-tag': 'jbxu5',
    },
  });
}

/** 机构详情 */
export async function getBankInfo(id: number) {
  return request<FinancialInstitution.ResultBankInfo>(
    `/antelope-finance/bank/mng/getBankById?id=${id}`,
    {
      method: 'get',
      headers: {
        'rpc-tag': 'jbxu5',
      },
    },
  );
}

/** 一级二级机构列表 */
export async function getQueryBank2() {
  return request<FinancialInstitution.ResultBankInfo>('/antelope-finance/bank/mng/queryBank2', {
    method: 'get',
    headers: {
      'rpc-tag': 'jbxu5',
    },
  });
}

/** 新增编辑 */
export async function saveOrUpdateInstitution(data?: Record<string, any>) {
  return request<FinancialInstitution.ResultsaveOrUpdate>('/antelope-finance/bank/mng/addBank', {
    method: 'post',
    data,
    headers: {
      'rpc-tag': 'jbxu5',
    },
  });
}

/**
 * 删除
 * @param params
 */
export async function removeBank(id: number) {
  return request<any>(`/antelope-finance/bank/mng/delBank?id=${id}`, {
    method: 'get',
    headers: {
      'rpc-tag': 'jbxu5',
    },
  });
}

/**
 * 门户合作机构查询
 * @param params
 */
export async function queryCooperateOrg() {
  return request<any>(`/antelope-finance/mng/bank/queryCooperateOrg`, {
    method: 'get',
    headers: {
      'rpc-tag': 'jbxu5',
    },
  });
}
