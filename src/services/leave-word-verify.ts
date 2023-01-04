import { request } from 'umi';
/**
 * 留言审核列表
 */

// 留言审核列表
export function getCommentPage(data: {
  name?: string // 用户名
  content?: string // 内容
  startDateTime?: string // yyyy-MM-dd HH:mm:ss
  endDateTime?: string // 
  status?: string // 审核状态 枚举
  tabEnum?: string // 所属板块
  pageSize?: number;
  pageIndex?: number;
}) {
  return request('/antelope-manage/comments/page',{
    method: 'post',
    data,
  })
}
//查询当前审核的留言
export function getCommentsCurrent(params: {
  commentId: string
}) {
  return request('/antelope-manage/comments/current',{
    method: 'get',
    params,
  })
}
// 查询详情中的留言列表
export function getCommentsDetailPage(params: {
  detailId?: string // 详情id
  tabEnum?: string // 所属板块
  pageSize?: number;
  pageIndex?: number;
}) {
  return request('/antelope-manage/comments/detail/page',{
    method: 'get',
    params,
  })
}

// 留言管理列表
export function getCommentsManagePage(data: {
  name?: string // 用户名
  startDateTime?: string // 开始时间
  endDateTime?: string // 结束时间
  status?: string // 留言状态
  tabEnum?: string // 所属板块
  pageSize?: number;
  pageIndex?: number;
}) {
  return request('/antelope-common/mng/comments/manage/page', {
    method: 'post',
    data,
  })
}

// 留言管理 - 上架
export function getCommentsManageOnshelf(data: {
  id: number
}) {
  return request('/antelope-common/mng/comments/manage/onShelf', {
    method: 'post',
    data,
  })
}
// 留言上架
export function getCommentsManageOffShelf(data: {
  id: number
}) {
  return request('/antelope-common/mng/comments/manage/offShelf', {
    method: 'post',
    data,
  })
}