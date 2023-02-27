import { request } from '@@/plugin-request/request';

/** 获取 驾驶舱信息 */
export async function getCockPit() {
  return request<any>('/antelope-finance/mng/cockpit/query', {
    method: 'get',
  });
}

/** 获取 驾驶舱信息 */
export async function getSummaryAndMap(data?: { [key: string]: any }) {
  return request<any>('/antelope-finance/mng/cockpit/queryChange', {
    method: 'post',
    data,
  });
}

/** 获取 金融转化 */
export async function queryCVR(data?: { [key: string]: any }) {
  return request<any>('/antelope-finance/mng/cockpit/queryCVR', {
    method: 'post',
    data,
  });
}

/** 获取 分润金额 */
export async function getShareProfit() {
  return request<any>('/antelope-finance/mng/cockpit/getShareProfit', {
    method: 'get',
  });
}


/** 获取 机构列表 */
export async function queryBank() {
  return request<any>('/antelope-finance/bank/mng/queryBank', {
    method: 'get',
  });
}

/** 获取产品 */
export async function getProduct(bankId: number) {
  return request<any>(`/antelope-finance/product/getProductByBankId?bankId=${bankId}`, {
    method: 'get',
  });
}


/** 获取合同金额 */
export async function getProjectContract() {
  return request<any>('/antelope-finance/mng/cockpit/getProjectContract', {
    method: 'get',
  });
}

/** 新增或者修改分润金额 */
export async function addOrUpdateShareProfit(data?: { [key: string]: any }) {
  return request<any>('/antelope-finance/mng/cockpit/addOrUpdateShareProfit', {
    method: 'post',
    data
  });
}


/** 新增或者修改合同金额 */
export async function addOrUpdateProjectContract(data?: { [key: string]: any }) {
  return request<any>('/antelope-finance/mng/cockpit/addOrUpdateProjectContract', {
    method: 'post',
    data
  });
}
