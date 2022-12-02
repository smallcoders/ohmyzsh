import { request } from '@@/plugin-request/request';
import FinancialCustomersManage from '@/types/financial_customers_manage';

/** 获取 列表 */
export async function getCustomers(data?: { [key: string]: any }) {
  return request<FinancialCustomersManage.ResultList>('/antelope-finance/customer/mng/queryCustomerInfo', {
    method: 'post',
    data,
  });
}

/** 获取 详情 */
export async function getCustomersDetail(params?: { [key: string]: any }) {
  return request<any>('/antelope-finance/customer/mng/getCustomerInfo', {
    method: 'get',
    params,
    headers: {
      'rpc-tag': 'jianwang44'
    }
  });
}

/** 获取 详情 */
export async function editCustomersDetail(data?: { [key: string]: any }) {
  return request<any>('/antelope-finance/customer/mng/editCustomerInfo', {
    method: 'POST',
    data,
    headers: {
      'rpc-tag': 'jianwang44'
    }
  });
}
