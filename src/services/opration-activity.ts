// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** 新增渠道值 */
export async function postAddChannel(data?: { [key: string]: any }) {
  return request<any>('/antelope-manage/manage/active/channel/add', {
    method: 'POST',
    data
  });
}

/** 根据id查询渠道值 */
export async function getChannelById(id:string) {
  return request<any>(`/antelope-manage/manage/active/channel/getById/${id}`, {
    method: 'GET',
    // headers: {
    //   'rpc-tag': 'jbxu5',
    // },
  });
}

/** 根据id删除渠道值 */
export async function postDeleteChannel(id:string) {
  return request<any>(`/antelope-manage/manage/active/channel/delete/${id}`, {
    method: 'POST',
  });
}

/** 更新渠道值 */
export async function postUpdateChannel(data?: { [key: string]: any} ) {
  return request<any>('/antelope-manage/manage/active/channel/update', {
    method: 'POST',
    data
  });
}

/** 获取全部渠道值 */
export async function getAllChannel(options?: { [key: string]: any }) {
  return request<any>('/antelope-manage/manage/active/channel/getAll', {
    method: 'GET',
    params: { ...(options || {}) },
  });
}

/** 根据名称获取渠道值 */
export async function getChannelByName(name:string) {
  return request<any>(`/antelope-manage/manage/active/channel/getByName/${name}`, {
    method: 'GET',
  });
}

/** 新增场景值 */
export async function postAddScene(data?: { [key: string]: any}) {
  return request<any>('/antelope-manage/manage/active/scene/add', {
    method: 'POST',
    data
  });
}

/** 根据id查询场景值 */
export async function getSceneById(id:string) {
  return request<any>(`/antelope-manage/manage/active/scene/getById/${id}`, {
    method: 'GET',
    // headers: {
    //   'rpc-tag': 'jbxu5',
    // },
  });
}

/** 根据id删除场景值 */
export async function postDeleteScene(id:string) {
  return request<any>(`/antelope-manage/manage/active/scene/delete/${id}`, {
    method: 'POST',
  });
}

/** 更新场景值 */
export async function postUpdateScene(data?: { [key: string]: any} ) {
  return request<any>('/antelope-manage/manage/active/scene/update', {
    method: 'POST',
    data
  });
}

/** 获取全部场景值 */
export async function getAllScene(options?: { [key: string]: any }) {
  return request<any>('/antelope-manage/manage/active/scene/getAll', {
    method: 'GET',
    params: { ...(options || {}) },
  });
}

/** 根据名称获取场景值 */
export async function getSceneByName(name:string) {
  return request<any>(`/antelope-manage/manage/active/scene/getByName/${name}`, {
    method: 'GET',
  });
}

/** 渠道值分页查询 */
export async function postQueryChannelByPage(data?: { [key: string]: any} ) {
  return request<any>('/antelope-manage/manage/active/channel/query', {
    method: 'POST',
    data
  });
}


/** 场景值分页查询 */
export async function postQuerySceneByPage(data?: { [key: string]: any} ) {
  return request<any>('/antelope-manage/manage/active/scene/query', {
    method: 'POST',
    data
  });
}


/** 检查渠道值是否存在*/
export async function getCheckedChannel(name:string) {
  return request<any>(`/antelope-manage/manage/active/channel/exist/${name}`, {
    method: 'GET',
  });
}

/** 检查场景值是否存在*/
export async function getCheckedScene(name:string) {
  return request<any>(`/antelope-manage/manage/active/scene/exist/${name}`, {
    method: 'GET',
  });
}
