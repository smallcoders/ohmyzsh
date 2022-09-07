import { request } from 'umi';

/**
 * 举报
 */

// 分页查询
export function getReportPage(data: {
  reportType?: string,
  reportLoginName?: string // 举报人用户名
  startCreateTime?: string // yyyy-MM-dd HH:mm:ss
  endCreateTime?: string // 
  reportPhone?: string // 举报人电话
  processed?: boolean // 处理状态 true已处理 false未处理
  pageSize?: number;
  pageIndex?: number;
}) {
  return request('/antelope-common/mng/common/report/page',{
    method: 'post',
    data,
  })
}

// 处理举报记录
export function getReportProcessed(data: {
  id: number 
  processScheme: string // 处理方案 枚举
  remark?: string // 处理补充说明
}) {
  return request('/antelope-common/mng/common/report/processed',{
    method: 'post',
    data,
  })
}

// 举报详情
export function getReportDetail(params: {
  reportId: number
}) {
  return request('/antelope-common/mng/common/report/detail',{
    method: 'get',
    params,
  })
}

// 根据id查询留言
export function getCommentsDetail(params: {
  commentsId: number
}) {
  return request('/antelope-common/mng/comments/detail',{
    method: 'get',
    params,
  })
}

