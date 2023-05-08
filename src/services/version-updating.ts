/**
 * 版本更新管理
 */
import { request } from 'umi';

/**
 * 新增
 */
export function getVersionAdd(data: {
  id?: number
  date?: string // 上线日期
  system?: string // 操作系统
  version?: string // 版本号
  content?: string // 版本更新内容


}) {
  return request(`/antelope-common/mng/app/version/add`, {
    method: 'post',
    data,
  })
}

/**
 * 删除
 */
export function getVersionDelete(id: string) {
  return request(`/antelope-common/mng/app/version/delete?id=${id}`)
}