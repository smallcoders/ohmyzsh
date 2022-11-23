import { request } from 'umi';
import Common from '@/types/common';

/**
 * 保存
 * @returns
 */
export async function saveTemplate(data?: { [key: string]: any }) {
  return request<Common.ResultCode & { result: any }>(`/antelope-common/mng/template/save`, {
    method: 'post',
    data,
  });
}


/**
 * 历史页面记录
 * @returns
 */
export async function getPageList(data?: { [key: string]: any }) {
  return request<any>(`/antelope-common/mng/template/page/query`, {
    method: 'get',
    params: data,
  });
}

/**
 * 根据id查询模版信息
 * @returns
 */
export async function getTemplatePageInfo(data?: { [key: string]: any }) {
  return request<any>(`/antelope-common/mng/template/info`, {
    method: 'get',
    params: data,
  });
}
