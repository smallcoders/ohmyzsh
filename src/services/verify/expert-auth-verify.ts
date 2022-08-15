/* 审核待办-专家认证审核 */
import { request } from 'umi';
import Common from '@/types/common.d';
import EnterpriseAdminVerify from '@/types/enterprise-admin-verify.d';

// 分页查询列表
export async function httpPostExpertAuthVerifyPage(data?: { [key: string]: any }) {
  return request<EnterpriseAdminVerify.RecordList>('/antelope-manage/expert/auditPage', {
    method: 'post',
    data,
  });
}

// 审核详情
export async function httpGetExpertAuthVerifyDetail(id: string) {
  return request<Common.ResultCode & { result: any }>(
    `/antelope-manage/expert/auditDetail?auditId=${id}`,
  );
}

// 审核通过/拒绝
export async function httpPostAuditExpertAuth(data?: { [key: string]: any }) {
  return request<Common.ResultCode>('/antelope-manage/orgManagerRequest/check', {
    method: 'post',
    data,
  });
}
