import Common from '@/types/common';
import LogoutVerify from '@/types/user-config-logout-verify';
import { request } from 'umi';

// ----------------------发票管理----------------------------
/**
 * 分页查询
 * @param params
 */
 export async function getBillPage(data?: { [key: string]: any }) {
    return request<LogoutVerify.ResultList>('/invoice/queryByParam', {
      method: 'post',
      data,
    });
}