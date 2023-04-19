/**
 * 服务号
 */
import Common from '@/types/common';
import ActivityProject from '@/types/activity-project';
import { request } from 'umi';

// 运营用户id姓名列表
export function  httpAccountList (params: {
  name?: string //用户姓名
  all?: boolean // true全部 false非运营超级管理员 默认
}) {
  return request(`/antelope-manage/account/list`, {
    method: 'get',
    params
  })
}

// 权限人员 多选list 做了调整
export async function pageQuery(params: {
  current?: number;
  pageIndex?: number;
  pageSize?: number;
  loginName?: string;
  name?: string;
  phone?: string;
  roleId?: string;
}) {
  return request('/antelope-manage/account/pageQuery', {
    method: 'POST',
    params: { ...params, pageIndex: params.pageIndex },
  }).then((json) => ({
    success: json.code === 0,
    total: json.totalCount,
    data: json.result,
  }));
}

// 服务号管理-分页查询
export function httpServiceAccountMannagePage (data: {
  innerName?: string // 服务号名称- 内部名称
  pageSize?: number;
  pageIndex?: number;
  current?: number; // 当前分页
}) {
  return request(`/antelope-business/mng/serviceAccount/manage/page`, {
    method: 'post',
    data: {...data, pageIndex: data.current},
  }).then((e: { code: number; totalCount: any; result: any}) => (
    {
      success: e.code === 0,
      total: e.totalCount,
      data: e.result,
    }
  ))
}

// 服务号管理-保存
export async function httpServiceAccountManageSave(data: {
  id?: number // 主键 空新增，不为空编辑
  innerName: string // 服务号名称- 内部名称
  accountIdList: Array<Number> // 服务号管理id 多个使用,分割
}) {
  return request(`/antelope-business/mng/serviceAccount/manage/save`, {
    method: 'post',
    data,
  })
}

// 服务号管理-删除政府信息
export function httpServiceAccountManageDel(id: string) {
  return request(`/antelope-business/mng/serviceAccount/manage/del?serviceAccountId=${id}`, {
    method: 'DELETE',
  })
}

// 服务号运营-列表
export function httpServiceAccountOperationList() {
  return request(`/antelope-business/mng/serviceAccount/operation/list`, {
    method: 'post'
  })
}

// 服务号运营-下架
export function httpServiceAccountOffShelf(data: any) {
  return request(`/antelope-business/mng/serviceAccount/operation/offShelf?serviceAccountId=${data}`, {
    method: 'put',
    data,
  })
}

// 草稿箱列表
export function httpArticleDrafList(
  id: string // 服务号id
) {
  return request(`/antelope-business/mng/serviceAccount/article/draftList?serviceAccountId=${id}`, {
    method: 'get',
  })
}

// 图文-暂存
export async function httpArticlePictureTextSave(data: {
  id?: number |undefined // 主键
  serviceAccountId?: number |undefined // 服务号Id
  title?: string // 标题
  authorName?: string // 作者
  coverId?: number // 封面图文件id
  content?: string // 文章内容
  realTimePublishing?: boolean // 实时发布 true实时发布 false预约发布
  publishTime?: string // 发布时间
  syncIndustrial?: boolean // 同步到产业圈 true同步 false不同步
}) {
  return request(`/antelope-business/mng/serviceAccount/article/pictureText/save`, {
    method: 'post',
    data,
  })
}

// 图文-提交
export async function httpServiceAccountPictureTextSubmit(data: {
  id?: number |undefined // 主键
  serviceAccountId?: number |undefined // 服务号Id
  title?: string // 标题
  authorName?: string // 作者
  coverId?: number // 封面图文件id
  content?: string // 文章内容
  realTimePublishing?: boolean // 实时发布 true实时发布 false预约发布
  publishTime?: string // 发布时间
  syncIndustrial?: boolean // 同步到产业圈 true同步 false不同步
}) {
  return request<any>(`/antelope-business/mng/serviceAccount/article/pictureText/submit`, {
    method: 'post',
    data,
    // responseType: 'blob',
  })
}

// 图片 - 暂存
export async function httpServiceAccountPictureSave(data: {
  id?: number |undefined // 主键
  serviceAccountId?: number |undefined // 服务号Id
  title?: string // 标题
  coverId?: number // 封面图文件id
  content?: string // 描述信息
  attachmentIdList?: number[] //图片
  realTimePublishing?: boolean // 实时发布 true实时发布 false预约发布
  publishTime?: string // 发布时间
  syncIndustrial?: boolean // 同步到产业圈 true同步 false不同步
}) {
  return request(`/antelope-business/mng/serviceAccount/article/picture/save`, {
    method: 'post',
    data,
    // responseType: 'blob',
  })
}

// 图片 - 提交
export async function httpServiceAccountPictureSubmit(data: {
  id?: number |undefined // 主键
  serviceAccountId?: number |undefined // 服务号Id
  title?: string // 标题
  coverId?: number // 封面图文件id
  content?: string // 描述信息
  attachmentIdList?: number[] //图片
  realTimePublishing?: boolean // 实时发布 true实时发布 false预约发布
  publishTime?: string // 发布时间
  syncIndustrial?: boolean // 同步到产业圈 true同步 false不同步
}) {
  return request(`/antelope-business/mng/serviceAccount/article/picture/submit`, {
    method: 'post',
    data,
    // responseType: 'blob',
  })
}

// 文本 - 暂存
export async function httpServiceAccountTextSave(data: {
  id?: number |undefined // 主键
  serviceAccountId?: number |undefined // 服务号Id
  content?: string // 文本内容
  realTimePublishing?: boolean // 实时发布 true实时发布 false预约发布
  publishTime?: string // 发布时间
  syncIndustrial?: boolean // 同步到产业圈 true同步 false不同步
}) {
  return request(`/antelope-business/mng/serviceAccount/article/text/save`, {
    method: 'post',
    data,
    // responseType: 'blob',
  })
}

// 文本 - 提交
export async function httpServiceAccountTextSubmit(data: {
  id?: number |undefined // 主键
  serviceAccountId?: number |undefined // 服务号Id
  content?: string // 文本内容
  realTimePublishing?: boolean // 实时发布 true实时发布 false预约发布
  publishTime?: string // 发布时间
  syncIndustrial?: boolean // 同步到产业圈 true同步 false不同步
}) {
  return request(`/antelope-business/mng/serviceAccount/article/text/submit`, {
    method: 'post',
    data,
    // responseType: 'blob',
  })
}

// 视频-暂存
export async function httpServiceAccountVideoSave(data: {
  id?: number |undefined // 主键
  serviceAccountId?: number |undefined // 服务号Id
  title?: string // 标题
  authorName?: string // 作者
  coverId?: number // 封面图文件id
  content?: string // 视频介绍
  attachmentId?: number // 视频文件id
  realTimePublishing?: boolean // 实时发布 true实时发布 false预约发布
  publishTime?: string // 发布时间
  syncIndustrial?: boolean // 同步到产业圈 true同步 false不同步
}) {
  return request(`/antelope-business/mng/serviceAccount/article/video/save`, {
    method: 'post',
    data,
    // responseType: 'blob',
  })
}

// 视频-提交
export async function httpServiceAccountVideoSubmit(data: {
  id?: number |undefined // 主键
  serviceAccountId?: number |undefined // 服务号Id
  title?: string // 标题
  authorName?: string // 作者
  coverId?: number // 封面图文件id
  content?: string // 视频介绍
  attachmentId?: number // 视频文件id
  realTimePublishing?: boolean // 实时发布 true实时发布 false预约发布
  publishTime?: string // 发布时间
  syncIndustrial?: boolean // 同步到产业圈 true同步 false不同步
}) {
  return request(`/antelope-business/mng/serviceAccount/article/video/submit`, {
    method: 'post',
    data,
    // responseType: 'blob',
  })
}

// 音频-暂存
export function httpServiceAccountAudioSave(data: {
  id?: number |undefined // 主键
  serviceAccountId?: number |undefined // 服务号Id
  title?: string // 标题
  authorName?: string // 作者
  coverId?: number // 封面图文件id
  content?: string // 音频介绍
  attachmentId?: number // 音频文件id
  realTimePublishing?: boolean // 实时发布 true实时发布 false预约发布
  publishTime?: string // 发布时间
  syncIndustrial?: boolean // 同步到产业圈 true同步 false不同步
}) {
  return request(`/antelope-business/mng/serviceAccount/article/audio/save`, {
    method: 'post',
    data,
    // responseType: 'blob',
  })
}

// 音频-提交
export function httpServiceAccountAudioSubmit(data: {
  id?: number |undefined // 主键
  serviceAccountId?: number |undefined // 服务号Id
  title?: string // 标题
  authorName?: string // 作者
  coverId?: number // 封面图文件id
  content?: string // 音频介绍
  attachmentId?: number // 音频文件id
  realTimePublishing?: boolean // 实时发布 true实时发布 false预约发布
  publishTime?: string // 发布时间
  syncIndustrial?: boolean // 同步到产业圈 true同步 false不同步
}) {
  return request(`/antelope-business/mng/serviceAccount/article/audio/submit`, {
    method: 'post',
    data,
    // responseType: 'blob',
  })
}

// 草稿箱列表
export function httpServiceAccountArticleDraftList(id: string) {
  return request(`/antelope-business/mng/serviceAccount/article/draftList?serviceAccountId=${id}`, {
    method: 'get',
  })
}


// 发布记录列表
export function httpServiceAccountPublishPage (data: {
  serviceAccountId?: any // 服务号Id
  title?: string // 标题/内容
  pageSize?: number;
  pageIndex?: number;
  current?: number;
}) {
  return request(`/antelope-business/mng/serviceAccount/article/publishPage`, {
    method: 'post',
    data: {...data, pageIndex: data.current},
    // responseType: 'blob',
  }).then((e: { code: number; totalCount: any; result: any}) => (
    {
      success: e.code === 0,
      total: e.totalCount,
      data: e.result,
    }
  ))
}

// 文章-下架
export function httpServiceAccountArticleOffShelf(data: any) {
  return request(`/antelope-business/mng/serviceAccount/article/offShelf?serviceAccountArticleId=${data}`, {
    method: 'put',
    // data,
  })
}

// 文章-删除
export function httpServiceAccountArticleDel(id: any) {
  return request(`/antelope-business/mng/serviceAccount/article/del?serviceAccountArticleId=${id}`, {
    method: 'DELETE',
  })
}

// 服务号设置-提交
export function httpServiceAccountOperationSubmit(data: {
  id?: number // 主键
  name?: string // 服务号名称
  logoId?: number // 服务号logo文件id
  introduction?: string // 介绍
  servicePhone?: string // 客服电话
  address?: string // 所在地址
  menus?: any // 菜单
}) {
  return request(`/antelope-business/mng/serviceAccount/operation/submit`, {
    method: 'post',
    data,
    // responseType: 'blob',
  })
}

// 服务号运营-服务号设置-暂存
export function httpServiceAccountOperationSave(data: {
  id?: number // 主键
  name?: string // 服务号名称
  logoId?: number // 服务号logo文件id
  introduction?: string // 介绍
  servicePhone?: string // 客服电话
  address?: string // 所在地址
  menus?: any // 菜单
}) {
  return request(`/antelope-business/mng/serviceAccount/operation/save`, {
    method: 'post',
    data,
    // responseType: 'blob',
  })
}

// 草稿箱 文章-详情
export function httpServiceAccountArticleDetail(id: string) {
  return request(`/antelope-business/mng/serviceAccount/article/detail?serviceAccountArticleId=${id}`, {
    method: 'get',
    // params
  })
}

// 服务号运营-服务号设置-详情
export function httpServiceAccountOperationDetail(id: string) {
  return request(`/antelope-business/mng/serviceAccount/operation/detail?serviceAccountId=${id}`, {
    method: 'get',
  })
}

// 操作日志
export function httpServiceAccountArticleLogList(id: string) {
  return request(`/antelope-business/mng/serviceAccount/article/logList?serviceAccountArticleId=${id}`, {
    method: 'get',
  })
}

// 服务号名称可用查询
export function httpServiceAccountManageNameAble(params: {
  manage?: boolean
  name: string
}) {
  return request(`/antelope-business/mng/serviceAccount/manage/nameAble?manage=${params?.manage}&name=${params?.name}`, {
    method: 'get',
  })
}
