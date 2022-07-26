import { request } from 'umi';
import type Common from '@/types/common';
import type SolutionTypes from '@/types/solution';

/**
 * 地市宣传页管理
 */
// 城市宣传页分页查询
export function getPropagandaDataList(params: {
  areaName?: string;
  pageSize?: number;
  pageIndex?: number;
  current?: number; // 当前分页
}) {
  return request('/antelope-science/mng/cityPropaganda/page',{
    method: 'GET',
    params: { ...params, pageIndex: params.current}
  }).then((e: { code: number; totalCount: any; result: any }) => ({
    success: e.code === 0,
    total: e.totalCount,
    data: e.result,
  }))
}

// 删除某个城市宣传页
export function removePropaganda(id: string) {
  return request(`/antelope-science/mng/cityPropaganda/?id=${id}`,{
    method: 'DELETE',
  })
}

// 上/下架 某个城市宣传页
export function cityPropaganda(id: string) {
  return request('/antelope-science/mng/cityPropaganda',{
    method: 'put',
    params: {
      id
    },
  })
}

// 获取某个城市宣传页
export function getCityPropagandaData(id: string) {
  return request('/antelope-science/mng/cityPropaganda', {
    method: 'get',
    params: {
      id
    },
  })
}

// 获取企业需求列表
export function getEnterpriseDemandList(params: {
  name?: string;
  pageSize?: number;
  pageIndex?: number;
}) {
  return request('/antelope-science/mng/cityPropaganda/cityDemand',{
    method: 'get',
    params,
  })
}

// 获取创新需求列表
export function getCreativeDemandList(params: {
  name?: string;
  pageSize?: number;
  pageIndex?: number;
}) {
  return request('/antelope-science/mng/cityPropaganda/cityCreativeDemand',{
    method: 'get',
    params,
  })
}

// 获取解决方案列表
export function getPropagandaDemandList(params: {
  name?: string;
  pageSize?: number;
  pageIndex?: number;
}) {
  return request('/antelope-science/mng/cityPropaganda/citySolution',{
    method: 'get',
    params,
  })
}

// 保存某个城市宣传页 - 新增/更新 可调用此接口
export function getChangePropaganda(data: {
  id?: number;
  areaCode?: string; // 区域码感觉没用
  state?: string; // 问问这个是什么
  cityBannerId?: number; // 图片
  demandCount?: number; // 企业需求数量
  solutionCount?: number; // 服务方案数量
  solutionSignIn?: number; // 服务报名数量
  enterpriseDemandIds?: any[]; // 企业需求
  creativeDemandIds?: any[]; // 企业需求
  solutionIds?: any[]; // 企业需求
  exchangeDemandIds?: any[]; // 企业需求

}) {
  return request('/antelope-science/mng/cityPropaganda',{
    method: 'post',
    data,
  })
}

// 取城市活动可用城市下拉
export function getAreaLabel() {
  return request('/antelope-science/mng/cityPropaganda/areaLabel')
}

// 保存对接成效
export function addExchange(data: {
  id?: string;
  name: string;
  type?: string; // 类型
  publishName: string; // 发布人/发布单位
  subscribeName: string; // 对接方
  state: string; // 状态
  exchangeTime?: string; // 对接时间 
}) {
  return request('/antelope-science/web/exchange/demand',{
    method: 'post',
    data,
  })
}
// 删除对接成效
export function deleteExchange(id: string) {
  return request(`/antelope-science/web/exchange/demand?id=${id}`,{
    method: 'DELETE',
  })
}


/**
 * 地市活动列表
 * GET params
 */
export function getCityActivity(params: {
  areaName?: string; // 区域名称
  state?: string; // 状态
  current?: number; // 当前分页
  pageSize?: number;
  pageIndex?: number;
}) {
  return request('/antelope-science/mng/cityActivity/page',{
    method: 'GET',
    params: { ...params, pageIndex: params.current},
  }).then((e: { code: number; totalCount: any; result: any }) => ({
    success: e.code === 0,
    total: e.totalCount,
    data: e.result,
  }))
}

// 删除某个城市活动
export function deleteDityActivity(id: string) {
  return request(`/antelope-science/mng/cityActivity/?id=${id}`,{
    method: 'DELETE',
  })
}

// 保存 或修改 某个城市活动
export function cityActivity(data: {
  id?: number;
  areaCode?: string; // 城市名称
  state?: string; // 状态
  remark?: string; // 活动说明
}) {
  return request('/antelope-science/mng/cityActivity',{
    method: 'post',
    data,
  })
}

// 获取城市活动可用城市下拉
export function areaLabel() {
  return request('/antelope-science/mng/cityActivity/areaLabel',{
    method: 'get',
  })
}
