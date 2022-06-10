// @ts-ignore
/* eslint-disable */
import Common from '@/types/common';
import UserFeedback from '@/types/user-feedback';
import { request } from 'umi';

/** 获取用户反馈记录分页 */
export async function getUserFeedbackPage(data?: { [key: string]: any }) {
  return request<UserFeedback.RecordList>('/antelope-manage/feedback', {
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
export async function markUserFeedContracted(id: string, remark: string) {
  return request<Common.ResultCode & { result: any }>(`/antelope-manage/feedback/sign`, {
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
export async function updateUserFeedBackRemark(id: string, remark: string) {
  return request<Common.ResultCode & { result: any }>(`/antelope-manage/feedback/remark`, {
    method: 'put',
    data: {
      id,
      remark,
    },
  });
}
