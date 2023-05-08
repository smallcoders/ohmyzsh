/**
 * 版本更新管理
 */
import { request } from 'umi';

/**
 * 版本更新管理列表
 */
export function getVersionPage(data: {
  version?: string // 版本号
  system?: string // 操作系统 IOS Android
  startDate?: string // 上线日期 开始
  endDate?: string // 上线日期 结束
  pageSize?: number
  pageIndex?: number
}) {
  return request(`/antelope-common/mng/app/version/page`, {
    method: 'post',
    data,
  })
}

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