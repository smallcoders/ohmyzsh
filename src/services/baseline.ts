import { request } from 'umi';

// 招投标 分页
export async function getBidPage(data?: Record<string, any>) {
  return request<any>('/antelope-industrial/mng/tenderingBidding/page', {
    method: 'post',
    data,
  });
}

// 招投标 详情 id
export async function getBidDetail(params?: Record<string, any>) {
  return request<any>('/antelope-industrial/mng/tenderingBidding/queryDetailById', {
    method: 'get',
    params,
  });
}

// 招投标 上下架
//id	是	isShelves	是	false
export async function onOffShelvesById(params?: Record<string, any>) {
  return request<any>('/antelope-industrial/mng/tenderingBidding/onOffShelvesById', {
    method: 'post',
    params,
  });
}

//删除 招投标 id
export async function deleteBid(params?: Record<string, any>) {
  return request<any>('/antelope-industrial/mng/tenderingBidding/deleteById', {
    method: 'delete',
    params,
  });
}
// 内容
// 文章列表
export async function getArticlePage(data?: Record<string, any>) {
  return request<any>('/antelope-industrial/mng/article/page/query', {
    method: 'post',
    data,
  });
}
export async function getArticleRiskCount(data?: Record<string, any>) {
  return request<any>('/antelope-industrial/mng/article/query/count', {
    method: 'post',
    data,
  });
}

// 文章详情
export async function getArticleDetail(id: string) {
  return request<any>(`/antelope-industrial/mng/article/detail/${id}`, {
    method: 'get',
  });
}

// 文章详情浏览信息
export async function getArticleStatisticPage(data?: Record<string, any>) {
  return request<any>('/antelope-industrial/mng/page/query/statistic/by/articleId', {
    method: 'post',
    data,
  });
}

// 新增文章
export async function addArticle(data?: Record<string, any>) {
  return request<any>('/antelope-industrial/mng/article/add', {
    method: 'post',
    data,
  });
}

// 风险审核
export async function auditArticle(content: string) {
  return request<any>(`/antelope-industrial/mng/article/audit`, {
    method: 'post',
    data: {
      content,
    },
  });
}

// 编辑文章
export async function editArticle(data?: Record<string, any>) {
  return request<any>('/antelope-industrial/mng/article/edit', {
    method: 'post',
    data,
  });
}

// 删除文章
export async function deleteArticle(id: string) {
  return request<any>(`/antelope-industrial/mng/article/delete/${id}`, {
    method: 'post',
  });
}

// 文章上下架接口
export async function onOffShelvesArticle(id: string, articleStatus: number) {
  return request<any>(`/antelope-industrial/mng/article/up-or-down/${id}/${articleStatus}`, {
    method: 'post',
  });
}

// 批量删除文章
export async function articleBatchDelete(data?: Record<string, any>) {
  return request<any>(`/antelope-industrial/mng/article/batch/delete`, {
    method: 'post',
    data,
  })
}

// 批量下架文章
export async function articleBatchOffShelves(data?: Record<string, any>) {
  return request<any>(`/antelope-industrial/mng/article/batch/up-or-down`, {
    method: 'post',
    data,
  })
}

// 置顶/取消置顶
//id	是	isTopping	true：置顶；false：取消置顶
export async function isTopArticle(data?: Record<string, any>) {
  return request<any>(`/antelope-industrial/mng/article/topping-or-not`, {
    method: 'post',
    data,
  });
}

// 获取全部内容类型
export async function getArticleType() {
  return request<any>(`/antelope-industrial/mng/get/all/article/types`, {
    method: 'get',
  });
}

// 获取全部标签
export async function getArticleTags() {
  return request<any>(`/antelope-industrial/mng/get/all/labels`, {
    method: 'get',
  });
}

// 标签
// 标签列表
export async function getTagPage(data?: Record<string, any>) {
  return request<any>('/antelope-industrial/mng/page/query/labels', {
    method: 'post',
    data,
  });
}

//标签详情
export async function getTagDetail(id: string) {
  return request<any>(`/antelope-industrial/mng/get/by/id/${id}`, {
    method: 'get',
  });
}

// 标签详情-关联用户
export async function getTagUserPage(data?: Record<string, any>) {
  return request<any>('/antelope-industrial/mng/linked/user/page/query', {
    method: 'post',
    data,
  });
}

// 标签详情-关联内容
export async function getTagContentPage(data?: Record<string, any>) {
  return request<any>('/antelope-industrial/mng/linked/article/page/query', {
    method: 'post',
    data,
  });
}
// 新增标签
export async function addTag(data?: Record<string, any>) {
  return request<any>('/antelope-industrial/mng/add/label', {
    method: 'post',
    data,
  });
}

// 编辑标签
export async function editTag(data?: Record<string, any>) {
  return request<any>('/antelope-industrial/mng/edit/label', {
    method: 'post',
    data,
  });
}

// 删除标签
export async function deleteTag(id: string) {
  return request<any>(`/antelope-industrial/mng/delete/label/${id}`, {
    method: 'post',
  });
}

// 推荐位管理 - 列表
export async function recommendForUserPage(data?: any) {
  return request<any>('/antelope-industrial/mng/recommendForUser/page', {
    method: 'post',
    data,
    headers: {
      'rpc-tag': 'local-dev',
    },
  });
}
// 新增推荐位
export async function addRecommendForUserPage(data?: any) {
  return request<any>('/antelope-industrial/mng/recommendForUser/add', {
    method: 'post',
    data,
  });
}
// 修改推荐位（是否启用，推荐位和标签的
export async function editRecommendForUserPage(data?: any) {
  return request<any>('/antelope-industrial/mng/recommendForUser/edit', {
    method: 'post',
    data,
  });
}
// 推荐位详情
export async function detailRecommendForUserPage(params?: any) {
  return request<any>('/antelope-industrial/mng/recommendForUser/detail', {
    method: 'get',
    params,
  });
}

// 用户浏览详情
export function getUserDetailBrowse(data?: any) {
  return request<any>('/antelope-industrial/mng/userDetail', {
    method: 'post',
    data,
  });
}
//会议管理
// 会议管理-分页查询
export async function getMeetingPage(data?: Record<string, any>) {
  return request<any>('/antelope-business/mng/meeting/page', {
    method: 'post',
    data,
  });
}

// 会议详情
export async function detailMeetingForUserPage(params?: any) {
  return request<any>('/antelope-business/mng/meeting/detail', {
    method: 'get',
    params,
  });
}

// 会议管理-删除会议
export async function deleteMeeting(meetingId?: any) {
  return request<any>(`/antelope-business/mng/meeting/del?meetingId=${meetingId}`, {
    method: 'DELETE',
  });
}

//会议管理-会议上架
export async function onShelfMeeting(params?: any) {
  return request<any>('/antelope-business/mng/meeting/onShelf', {
    method: 'put',
    params,
  });
}

//会议管理-会议下架
export async function offShelfMeeting(params?: any) {
  return request<any>('/antelope-business/mng/meeting/offShelf', {
    method: 'put',
    params,
  });
}

//会议管理-权重设置
export async function weightMeeting(data?: Record<string, any>) {
  return request<any>('/antelope-business/mng/meeting/weight', {
    method: 'put',
    data,
  });
}

// 会议管理-暂存
export async function saveMeeting(data?: Record<string, any>) {
  return request<any>('/antelope-business/mng/meeting/save', {
    method: 'post',
    data,
  });
}

// 会议管理-提交
export async function submitMeeting(data?: Record<string, any>) {
  return request<any>('/antelope-business/mng/meeting/submit', {
    method: 'post',
    data,
  });
}

//会议管理-报名列表
export async function queryMeetingPageList(data?: Record<string, any>) {
  return request<any>('/antelope-business/mng/meeting/enrollPage', {
    method: 'post',
    data,
  });
}

// 会议管理-报名列表导出
export async function exportMeetingData(params?: any) {
  return request<any>('/antelope-business/mng/meeting/enrollExport', {
    method: 'get',
    params,
    responseType: 'blob',
    getResponse: true,
  });
}

//会议设置-保存设置
export async function saveMeetingConfig(data?: Record<string, any>) {
  return request<any>('/antelope-business/mng/meeting/saveConfig', {
    method: 'post',
    data,
  });
}

// 会议设置-查询设置
export async function queryMeetingConfig(params?: any) {
  return request<any>('/antelope-business/mng/meeting/detailConfig', {
    method: 'get',
    params,
  });
}

// 会议管理-报名列表-表头
export async function queryEnrollTableHead(params?: any) {
  return request<any>('/antelope-business/mng/meeting/enrollTableHead', {
    method: 'get',
    params,
  });
}

//查询组织信息仅id、name
export async function queryListSimple(params?: any) {
  return request<any>('/antelope-business/mng/organization/listSimple', {
    method: 'post',
    params,
  });
}

//查询组织
export async function queryConvertOrg(data?: Record<string, any>) {
  return request<any>('/antelope-business/mng/organization/convertOrg', {
    method: 'post',
    data,
  });
}

// 热点资讯分页查询
export async function getHotNews(data?: Record<string, any>) {
  return request<any>('/antelope-industrial/mng/hot/news/config/list', {
    method: 'post',
    data,
  });
}

// 添加热点资讯
export async function saveHotNews(data?: Record<string, any>) {
  return request<any>('/antelope-industrial/mng/hot/news/config/save', {
    method: 'post',
    data,
  });
}

// 更新资讯已推送状态
export async function updateSendedNews(data?: any) {
  return request<any>('/antelope-industrial/mng/hot/news/config/sended/update', {
    method: 'PUT',
    data,
  });
}

// 删除资讯
export async function deleteHotNews(data?: Record<string, any>) {
  return request<any>(`/antelope-industrial/mng/hot/news/config/delete`, {
    method: 'delete',
    data
  });
}

// 新增全局悬浮窗广告
export async function addGlobalFloatAd(data?: Record<string, any>) {
  return request<any>(`/antelope-industrial/mng/add/global-float/ads`, {
    method: 'post',
    data
  });
}

// 全局悬浮窗广告详情
export async function getGlobalFloatAdDetail(id: any) {
  return request<any>(`/antelope-industrial/mng/get/ads/detail/${id}`, {
    method: 'get',
  });
}

// 版面以及全部用户标签
export async function getAllLayout() {
  return request<any>(`/antelope-industrial/mng/get/all/layout`, {
    method: 'get',
  });
}

// 部分用户标签
export async function getPartLabels(data?: Record<string, any>) {
  return request<any>(`/antelope-industrial/mng/page/query/labels`, {
    method: 'post',
    data
  });
}

// 获取广告列表
export async  function getGlobalFloatAds(data?: Record<string, any>) {
  return request<any>(`/antelope-industrial/mng/advertise/list`, {
    method: 'post',
    data
  });
}

// 删除
export async  function updateAdsStatus(id: number, status: number) {
  return request<any>(`/antelope-industrial/mng/up-or-down/ads/${id}/${status}`, {
    method: 'post',
  });
}


