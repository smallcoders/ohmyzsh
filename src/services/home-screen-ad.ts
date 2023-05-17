import { request } from 'umi';

/**
 * 新增/ 保存开屏广告
 */

export function httpAddSplash(data: {
  id?: number // 编辑id
  advertiseName?: string // 广告名称
  imgs?: any // 图片列表
  advertiseType?: string // 广告类型枚举：开屏广告（SPLASH_ADS）、弹窗广告（POP_UP_ADS）、内容流广告（CONTENT_STREAM_ADS）、全局悬浮窗广告（GLOBAL_FLOAT_ADS）
  countdown?: number // 广告倒计时长, 3,4,5
  siteLink?: string // 站内链接
  displayFrequency?: string // 启动频次，每次（EVERY_TIME）、间隔一次（INTERVAL_ONE_TIME）、每天最多显示3次（DAY_THREE_TIMES）
}) {
  return request(`/antelope-industrial/mng/add/splash/ads`, {
    method: 'POST',
    data,
  })
}

/**
 * 广告详情
 */
export function httpMngDetail(id: any) {
  return request(`/antelope-industrial/mng/get/ads/detail/${id}`)
}

/**
 * 获取所有版面
 */
export function httpMngLayout() {
  return request(`/antelope-industrial/mng/get/all/layout`)
}

/**
 * 获取广告列表
 */
export function httpAdvertiseList(data: {
  advertiseName?: string // 广告名称
  status?: string // 广告状态，0：暂存，1：上架，2：删除 3：下架
  advertiseType?: string // 开屏广告（SPLASH_ADS）、弹窗广告（POP_UP_ADS）、内容流广告（CONTENT_STREAM_ADS）、全局悬浮窗广告（GLOBAL_FLOAT_ADS）
  articleTypeId?: string // 版面id
  pageSize?: number;
  pageIndex?: number;
  current?: number; // 当前分页
}) {
  return request(`/antelope-industrial/mng/advertise/list`, {
    method: 'POST',
    data: {...data, pageIndex: data.current},
  }).then((e: { code: number; result: any}) => (
    {
      success: e.code === 0,
      total: e.result.total,
      data: e.result.list,
    }
  ))
}

/**
 * 文章审核
 */
export function httpIndustrialMngArticleAudit(data: {
  content?: string // 文章内容，富文本
}) {
  return request(`antelope-industrial/mng/article/audit`, {
    method: 'POST',
    data,
  })
}

/**
 * 上架/下架/刪除接口
 */
export function httpUpOrDownAds(id: string, status: number,) {
  return request(`/antelope-industrial/mng/up-or-down/ads/${id}/${status}`, {
    method: 'POST',
  })
}