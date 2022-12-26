import { request } from 'umi';

/**
 * 获取科产专栏的分页列表
 * @param data
 * @returns
 */
export async function getColumnByPage(data?: { [key: string]: any }) {
  return request<any>('/antelope-science/mng/creative/column/page', {
    method: 'post',
    data,
  });
}

/**
 * 获取科产专栏的查询详情
 */
export async function getColumnDetailById(creativeColumnId: any) {
  return request<any>(`/antelope-science/mng/creative/column/detail?creativeColumnId=${creativeColumnId}`, {
    method: 'get',
  });
}

/**
 * 上架
 * @param data
 * @returns
 */
export async function columnOnShelf(data?: { [key: string]: any }) {
  return request<any>('/antelope-science/mng/creative/column/onShelf', {
    method: 'post',
    data,
  });
}

/**
 * 上架
 * @param data
 * @returns
 */
export async function columnOffShelf(data?: { [key: string]: any }) {
  return request<any>('/antelope-science/mng/creative/column/offShelf', {
    method: 'post',
    data,
  });
}

/**
 * 分页查询点击详情列表
 * @param data
 * @returns
 */
export async function getClickPageDetailById(data?: { [key: string]: any }) {
  return request<any>('/antelope-science/mng/creative/column/clickPage', {
    method: 'post',
    data,
  });
}

/**
 * 发布科产专栏
 * @param data
 * @returns
 */
export async function saveColumn(data?: { [key: string]: any }) {
  return request<any>('/antelope-science/mng/creative/column/save', {
    method: 'post',
    data,
  });
}

/**
 * 删除科产专栏
 * */
export async function removeColumn(creativeColumnId: string) {
  return request<any>(`/antelope-science/mng/creative/column/del?creativeColumnId=${creativeColumnId}`, {
    method: 'DELETE',
  });
}

/**
 * 导出点击详情列表
 * @param data
 * @returns
 */
export async function loanClickExport(data?: { [key: string]: any }) {
  return request<any>('//antelope-science/mng/creative/column/clickExport', {
    method: 'post',
    data,
    responseType: 'blob',
    getResponse: true,
  });
}
