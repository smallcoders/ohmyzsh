import { request } from 'umi';
/**
 * 留言审核列表
 */

// 留言审核列表
export function getCommentPage(data: {
  name?: string // 用户名
  content?: string // 内容
  startCreateTime?: string // yyyy-MM-dd HH:mm:ss
  endCreateTime?: string // 
  status?: string // 审核状态 枚举
  tabEnum?: string // 所属板块
  pageSize?: number;
  pageIndex?: number;
}) {
  const key = 'rpc-tag'
  return request('/antelope-manage/comments/page',{
    method: 'post',
    data,
    headers: {[key]: 'yushen'}
  })
}
//查询当前审核的留言
export function getCommentsCurrent(params: {
  commentId: string
}) {
  const key = 'rpc-tag'
  return request('/antelope-manage/comments/current',{
    method: 'get',
    params,
    headers: {[key]: 'yushen'}
  })
}
// 查询详情中的留言列表
export function getCommentsDetailPage(params: {
  detailId?: string // 详情id
  tabEnum?: string // 所属板块
  pageSize?: number;
  pageIndex?: number;
}) {
  const key = 'rpc-tag'
  return request('/antelope-manage/comments/detail/page',{
    method: 'get',
    params,
    headers: {[key]: 'yushen'}
  })
}