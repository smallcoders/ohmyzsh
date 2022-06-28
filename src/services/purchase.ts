import Common from '@/types/common';
import LogoutVerify from '@/types/user-config-logout-verify';
import { request } from 'umi';

// ----------------------发票管理----------------------------
/**
 * 分页查询
 * @param params
 */
 export async function getBillPage(data?: { [key: string]: any }) {
    return request<LogoutVerify.ResultList>('/antelope-pay/mng/invoice/queryByParam', {
      method: 'post',
      data,
    });
}

// ----------------------标签管理----------------------------
/**
 * 分页查询
 * @param params
 */
 export async function getLabelPage(data?: { [key: string]: any }) {
  return request<LogoutVerify.ResultList>('/antelope-pay/mng/label/query', {
    method: 'post',
    data,
  });
}
/**
 * 标签新增/编辑/删除
 * @param params
 */
 export async function updateLabel(data?: { [key: string]: any }) {
  return request<LogoutVerify.ResultList>('/antelope-pay/mng/label/save', {
    method: 'post',
    data,
  });
}

// ----------------------供应商管理----------------------------
/**
 * 分页查询
 * @param params
 */
//  export async function getProviderPage(data?: { [key: string]: any }) {
//   return request<LogoutVerify.ResultList>('/antelope-pay/provider/search', {
//     method: 'get',
//     data,
//   });
// }
export async function getProviderPage(options?: { [key: string]: any }) {
  return request<LogoutVerify.ResultList>('/antelope-pay/provider/search', {
    method: 'get',
    params: { ...(options || {}) },
  });
}
export async function getProviderDetails(options?: { [key: string]: any }) {
  return request<LogoutVerify.ResultList>('/antelope-pay/provider/details', {
    method: 'get',
    params: { ...(options || {}) },
  });
}