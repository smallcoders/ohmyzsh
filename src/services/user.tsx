// @ts-ignore
/* eslint-disable */
import Common from '@/types/common';
import UserFeedback from '@/types/user-feedback';
import { request } from 'umi';

/** 获取用户分页 */
export async function getUserPage(data?: { [key: string]: any }) {
    return request<UserFeedback.RecordList>('/antelope-user/mng/user/queryUserManagePage', {
        method: 'post',
        data,
    });
}

/** 查询用户详情 */
export async function getUserDetail(id: string) {
    return request<UserFeedback.RecordList>(`/antelope-user/mng/user/getUserManageDetail?id=${id}`);
}

/** 获取用户注销分页 */
export async function getUserDeletePage(data?: { [key: string]: any }) {
    return request<UserFeedback.RecordList>('/antelope-user/mng/user/queryUserDeletePage', {
        method: 'post',
        data,
    });
}

export async function getExpertAuthDetail(id: string) {
    return request<any>(`/antelope-user/mng/expert/getExpertInfo?expertId=${id}`);
}

//查询全部跟用户绑定的场景值和渠道值
export async function getAllChannelAndScene() {
  return request<any>(`/antelope-user/mng/user/queryAllChannelAndScene`);
}

export async function getOrgInfoAuthDetail(id: string) {
    return request<any>(`/antelope-user/mng/org/getOrgInfo?id=${id}`);
}

/**
 * 导出
 * @param data
 * @returns
 */
export async function exportUsers(data?: { [key: string]: any }) {
    return request<UserFeedback.RecordList>('/antelope-user/mng/user/exportUser', {
        method: 'post',
        data,
    });
}
