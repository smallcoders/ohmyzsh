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
 * 保存数字化应用模版
 * @returns
 */
export async function saveAppTemplate(data?: { [key: string]: any }) {
  return request<Common.ResultCode & { result: any }>(`/antelope-common/mng/tmp/app/save`, {
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
    method: 'post',
    data,
    
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

/**
 * 修改模版状态
 * @returns
 */
export async function modifyTemplateState(data?: { [key: string]: any }) {
  return request<any>(`/antelope-common/mng/template/modify/state`, {
    method: 'post',
    data,
    
  });
}

/**
 * 查询模版数据
 * @returns
 */
export async function getTemplateData(data?: { [key: string]: any }) {
  return request<any>(`/antelope-common/mng/template/ans/data`, {
    method: 'post',
    data,
    
  });
}


/**
 * 查询模版操作记录
 * @returns
 */
export async function getTemplateOperationList(data?: { [key: string]: any }) {
  return request<any>(`/antelope-common/mng/template/log/list`, {
    method: 'get',
    params: data,
    
  });
}

/**
 * 操作记录
 * @returns
 */
export async function addOperationLog(data?: { [key: string]: any }) {
  return request<any>(`/antelope-common/mng/template/add/operate/log`, {
    method: 'post',
    data,
    
  });
}


/**
 * 导出数据
 * @returns
 */
export async function exportData(data?: { [key: string]: any }) {
  return request<any>(`/antelope-common/mng/template/export/data`, {
    method: 'post',
    data,
    responseType: 'blob',
    getResponse: true,
    
  });
}


/**
 * 素材分组信息
 * @returns
 */
export async function getGroupList() {
  return request<any>(`/antelope-common/mng/common/materialGroup/listAll`, {
    method: 'get',
    
  });
}

/**
 * 素材列表
 * @returns
 */
export async function getMaterialList(data?: { [key: string]: any }) {
  return request<any>(`/antelope-common/mng/common/material/queryByGroupsId`, {
    method: 'post',
    data,
    
  });
}

/**
 * 上传素材
 * @returns
 */
export async function uploadMaterial(data?: { [key: string]: any }) {
  return request<any>(`/antelope-common/mng/common/material/upload`, {
    method: 'post',
    data,
    
  });
}
