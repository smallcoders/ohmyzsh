import { request } from 'umi';

/**
 * 用户发布审核列表
 */
export function httpEnterpriseList(data: {
  title?: string // 标题
  topic?: string // 主题
  publishStartTime?: string // 发布时间-开始
  publishEndTime?: string // 发布时间-开始
  contentType?: string // 内容类型：1：供需简讯，5:供，4：需，2：企业动态，3：经验分享
  auditStatus: any // 必传[1,2,3] 审核状态：0：草稿；1：审核中；2：上架；3：审核不通过
  recommendFlag?: boolean // 推荐：true：已推荐，false:未推荐
  recommend?: boolean
  current?: number
  pageSize?: number
  pageIndex?: number
  queryType: number
  publishTime?: any
}) {
  return request(`/antelope-industrial/mng/enterprise/publish/page-query`, {
    method: 'POST',
    data: {...data, pageIndex: data.current}
  }).then((json) => (
    {
      success: json.code === 0,
      total: json.totalCount,
      data: json.result
    }
  ))
}

/**
 * 审核接口
 */
export function httpEnterpriseAudit(data: {
  id?: number
  auditStatus?: number // PUBLISH(2, "审核通过"),AUDIT_FAILED(3, "审核不通过");	
  auditReason?: string // 原因
}) {
  return request(`/antelope-industrial/mng/enterprise/publish/audit`,{
    method: 'POST',
    data
  })
}

/**
 * 推荐或者取消推荐接口
 */
export function httpEnterprisePublishRecommend(data: {
  id?: number
  recommend?: boolean // true:推荐；false:取消推荐
}) {
  return request(`/antelope-industrial/mng/enterprise/publish/recommend`, {
    method: 'POST',
    data
  })
}

/**
 * 上下架接口
 */
export function httpEnterprisePublishDown(data: {
  id?: number
  status?: boolean // 0：下架，1：下架
  auditReason?: string
}) {
  return request(`/antelope-industrial/mng/enterprise/publish/down-or-up`, {
    method: 'POST',
    data
  })
}

/**
 * 详情
 */
export function httpEnterpriseDetail(id: string) {
  return request(`/antelope-industrial/mng/enterprise/publish/detail/${id}`, {
    method: 'GET',
  })
}