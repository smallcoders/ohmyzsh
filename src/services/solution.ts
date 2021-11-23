import { request } from 'umi';
import type Common from '@/types/common';
import type SolutionType from '@/types/solution';

/**
 * 服务方案分页查询
 * @param params
 */
export async function pageQuery(params: {
  current?: number;
  pageSize?: number;
  name?: string;
  typeId?: number;
  providerName?: string;
  areaCode?: number;
  startPublishTime?: number;
  endPublishTime?: number;
}) {
  return request('/iiep-manage/solution/pageQuery', {
    method: 'POST',
    data: { ...params, pageIndex: params.current },
  }).then((e: { code: number; totalCount: any; result: any }) => ({
    success: e.code === 0,
    total: e.totalCount,
    data: e.result,
  }));
}

/**
 * 应用置顶
 * @param id
 */
export async function setTop(id: number) {
  return request('/iiep-manage/solution/setTop', {
    method: 'GET',
    params: { id },
  });
}

/**
 * 应用取消置顶
 * @param id
 */
export async function unsetTop(id: number) {
  return request('/iiep-manage/solution/unsetTop', {
    method: 'GET',
    params: { id },
  });
}

/**
 * 方案详情
 * @param id
 */
export async function getDetail(id: any) {
  return request<Common.ResultCode & { result: SolutionType.SolutionDetail }>(
    '/iiep-manage/solution/getDetail',
    {
      method: 'GET',
      params: { id },
    },
  );
}

/**
 * 方案意向企业列表
 * @param params
 */
export async function intentionPageQuery(params: {
  current?: number;
  pageSize?: number;
  solutionId: any;
  orgName?: string;
}) {
  return request('/iiep-manage/solution/intentionPageQuery', {
    method: 'POST',
    data: { ...params, pageIndex: params.current },
  }).then((e: { code: number; totalCount: any; result: any }) => ({
    success: e.code === 0,
    total: e.totalCount,
    data: e.result,
  }));
}
