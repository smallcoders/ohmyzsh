// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
// import Common from '@/types/common';

/**
 * 贷款列表
 * @param data
 * @returns
 */
export async function getLoanRecordList(data?: { [key: string]: any }) {
  return request<any>('/antelope-finance/loanRecord/mng/records', {
    method: 'post',
    data,
  });
}
/**
 * 累计授信金额、放款金额
 * @param data
 * @returns
 */
export async function getTotalAmount(data?: { [key: string]: any }) {
  return request<any>('/antelope-finance/loanRecord/mng/getTotalAmount', {
    method: 'post',
    data,
  });
}
/**
 * 金融机构下拉框，返回 银行名称
 * @param data
 * @returns
 */
export async function queryBankList(data?: { [key: string]: any }) {
  return request<any>('/antelope-finance/demand/queryBankList', {
    method: 'get',
  });
}
/**
 * 导出贷款记录
 * @param data
 * @returns
 */
export async function loanRecordExport(data?: { [key: string]: any }) {
  return request<any>('/antelope-finance/loanRecord/mng/exportRecords', {
    method: 'post',
    data,
    responseType: 'blob',
    getResponse: true,
  });
}
/**
 * 申请信息
 * @param data
 * @returns
 */
export async function getApplicationInfo(params: { id?: string }) {
  return request<any>('/antelope-finance/loanRecord/mng/getApplicationInfo', {
    method: 'get',
    params,
  });
}
/**
 * 授信详情
 * @param param
 * @returns
 */
export async function getCreditDetail(params: { id: string }) {
  return request<any>('/antelope-finance/loanRecord/mng/getCreditDetail', {
    method: 'get',
    params,
  });
}

/**
 * 授信信息录入
 * @param data
 * @returns
 */
export async function updateCreditInfo(data: { [key: string]: any }) {
  return request<any>('/antelope-finance/loanRecord/mng/updateCreditInfo', {
    method: 'post',
    data,
  });
}

/**
 * 备注
 * @param data
 * @returns
 */
export async function takeNotes(data: { [key: string]: any }) {
  return request<any>('/antelope-finance/loanRecord/mng/takeNotes', {
    method: 'post',
    data,
    
  });
}

/**
 * 剩余可借金额
 * @param data
 * @returns
 */
export async function getAvailAmount(data: { [key: string]: any }) {
  return request<any>('/antelope-finance/loanRecord/mng/getAvailAmount', {
    method: 'post',
    data,
    // headers: {
    //   'rpc-tag': 'jianwang44',
    // },
  });
}

/**
 * 放款信息录入
 * @param data
 * @returns
 */
export async function addOrUpdateTakeMoney(data: { [key: string]: any }) {
  return request<any>('/antelope-finance/loanRecord/mng/addOrUpdateTakeMoney', {
    method: 'post',
    data,
  });
}

/**
 * 删除放款信息
 * @param params
 * @returns
 */
export async function deleteTakeMoney(params: { [key: string]: any }) {
  return request<any>('/antelope-finance/loanRecord/mng/deleteTakeMoney', {
    method: 'get',
    params,
  });
}

/**
 * 放款列表
 * @param data
 * @returns
 */
export async function getTakeMoneyDetail(data: { [key: string]: any }) {
  return request<any>('/antelope-finance/loanRecord/mng/getTakeMoneyDetail', {
    method: 'post',
    data,
  });
}

/**
 * 新增/编辑还款信息
 * @param data
 * @returns
 */
export async function addBackMoney(data: { [key: string]: any }) {
  return request<any>('/antelope-finance/loanRecord/mng/addBackMoney', {
    method: 'post',
    data,
  });
}

/**
 * 删除还款信息
 * @param params
 * @returns
 */
export async function delBackMoney(params: { [key: string]: any }) {
  return request<any>('/antelope-finance/loanRecord/mng/delBackMoney', {
    method: 'get',
    params,
  });
}

/**
 * 还款列表
 * @param data
 * @returns
 */
export async function getBackMoneyDetail(data: { [key: string]: any }) {
  return request<any>('/antelope-finance/loanRecord/mng/getBackMoneyDetail', {
    method: 'post',
    data,
  });
}

/**
 * 提款及放款详情
 * @param params
 * @returns
 */
export async function getTakeDetail(params: { [key: string]: any }) {
  return request<any>('/antelope-finance/loanRecord/mng/getTakeDetail', {
    method: 'get',
    params,
  });
}
