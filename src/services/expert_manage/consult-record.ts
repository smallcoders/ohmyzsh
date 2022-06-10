// @ts-ignore
/* eslint-disable */
import Common from '@/types/common';
import ConsultRecord from '@/types/expert_manage/consult-record';
import { request } from 'umi';

/** 获取专家管理下咨询记录分页 */
export async function getConsultRecordPage(data?: { [key: string]: any }) {
  return request<ConsultRecord.RecordList>('/antelope-manage/expert/consultationPage', {
    method: 'post',
    data,
  });
}

/**
 * 标记已处理
 * @param id
 * @param remark
 * @returns
 */
export async function markConsultRecordContracted(id: string, remark: string) {
  return request<Common.ResultCode & { result: any }>(
    `/antelope-manage/expert/consultationRemark`,
    {
      method: 'post',
      data: {
        id,
        remark,
      },
    },
  );
}

/**
 * 修改专家资源下咨询记录备注
 * @param id
 * @param remark
 * @returns
 */
export async function updateConsultRecordRemark(id: string, remark: string) {
  return request<Common.ResultCode & { result: any }>(
    `/antelope-manage/expert/consultationRemarkEdit`,
    {
      method: 'post',
      data: {
        id,
        remark,
      },
    },
  );
}
