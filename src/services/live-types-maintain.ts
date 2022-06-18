import LiveTypesMaintain from '@/types/live-types-maintain.d';
import Common from '@/types/common';
import { request } from 'umi';

/**
 * 查询直播类型列表
 * @returns
 */
export async function getLiveTypesPage(data?: { [key: string]: any }) {
  return request<LiveTypesMaintain.RecordList>(`/antelope-live/web/type/queryTypePage`, {
    method: 'post',
    data,
  });
}

/**
 * 新增直播类型
 * @returns
 */
export async function addLiveType(data?: { [key: string]: any }) {
  return request<LiveTypesMaintain.RecordList>(`/antelope-live/web/type/save`, {
    method: 'post',
    data,
  });
}

/**
 * 编辑
 * @returns
 */
export async function updateLiveType(data?: { [key: string]: any }) {
  return request<Common.ResultCode & { result: any }>(`/antelope-live/web/type/update`, {
    method: 'put',
    data,
  });
}

/**
 * 删除
 * */
export async function removeAdminAccount(id: string) {
  return request<Common.ResultCode>(`/antelope-manage/creative/admin/delete?id=${id}`, {
    method: 'DELETE',
  });
}

/**
 * 重置密码
 * */
export async function resetAdminAccount(id: string) {
  return request<Common.ResultCode>(`/antelope-manage/creative/admin/reset?id=${id}`);
}
