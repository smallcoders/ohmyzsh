// @ts-ignore
/* eslint-disable */
import Common from '@/types/common';
import ActivityProject from '@/types/activity-project';
import { request } from 'umi';

/** 获取 列表 */
export async function getActivityProjectPage(data?: { [key: string]: any }) {
  return request<ActivityProject.ResultList>('/antelope-user/mng/AssistanceActivity/page', {
    method: 'get',
    params: data,
    headers: {
      'rpc-tag': 'yangye3',
    },
  });
}

/**
 * 更新标注
 */
export async function updateMark(data: { id: string | undefined; exchange: boolean }) {
  return request<Common.ResultCode>('/antelope-user/mng/AssistanceActivity/sign', {
    method: 'put',
    data,
    headers: {
      'rpc-tag': 'yangye3',
    },
  });
}
