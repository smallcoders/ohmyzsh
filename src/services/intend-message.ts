// @ts-ignore
/* eslint-disable */
import Common from '@/types/common';
import UserFeedback from '@/types/user-feedback';
import { request } from 'umi';

/** 获取用户反馈记录分页 */
export async function getIntendMessagePage(data?: { [key: string]: any }) {
  return request<UserFeedback.RecordList>('/antelope-manage/intendMessage', {
    method: 'post',
    data,
  });
}

/**
 * 标记已联系
 * @param id
 * @param remark
 * @returns
 */
export async function markIntendMessageContracted(id: string, remark: string) {
  return request<Common.ResultCode & { result: any }>(`/antelope-manage/intendMessage/sign`, {
    method: 'put',
    data: {
      id,
      remark,
    },
  });
}

/**
 * 置顶
 * @param id
 * @param remark
 * @returns
 */
export async function updateIntendMessageRemark(id: string, remark: string) {
  return request<Common.ResultCode & { result: any }>(`/antelope-manage/intendMessage/remark`, {
    method: 'put',
    data: {
      id,
      remark,
    },
  });
}
