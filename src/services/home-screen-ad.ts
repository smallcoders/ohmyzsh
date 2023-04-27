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

