/* 审核待办-企业信息审核 */
import { request } from 'umi';
import Common from '@/types/common.d';
import EnterpriseAdminVerify from '@/types/enterprise-admin-verify.d';

// 分页查询列表
export async function httpPostEnterpriseInfoVerifyPage(data?: { [key: string]: any }) {
  return request<EnterpriseAdminVerify.RecordList>('/antelope-manage/orgManagerRequest', {
    method: 'post',
    data,
  });
}

// 审核详情
export async function httpGetEnterpriseInfoVerifyDetail(id: string) {
  return request<Common.ResultCode & { result: any }>(
    `/antelope-manage/orgManagerRequest?id=${id}`,
  );
}

// 审核通过/拒绝
export async function httpPostAuditEnterpriseInfo(data?: { [key: string]: any }) {
  return request<Common.ResultCode>('/antelope-manage/orgManagerRequest/check', {
    method: 'post',
    data,
  });
}
