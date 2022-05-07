// @ts-ignore
/* eslint-disable */
import Common from '@/types/common';
import ConsultRecord from '@/types/expert_manage/consult-record';
import { request } from 'umi';

/** 获取专家管理下申请记录分页 */
export async function getConsultRecordPage(data?: { [key: string]: any }) {
  return request<ConsultRecord.RecordList>('/iiep-manage/expert/applyPage', {
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
export async function markApplyContracted(id: string, remark: string) {
  return request<Common.ResultCode & { result: any }>(`/iiep-manage/expert/applyRemark`, {
    method: 'post',
    data: {
      id,
      remark,
    },
  });
}

/**
 * 修改专家资源下申请记录备注
 * @param id
 * @param remark
 * @returns
 */
export async function updateApplyRecordRemark(id: string, remark: string) {
  return request<Common.ResultCode & { result: any }>(`/iiep-manage/expert/applyRemarkEdit`, {
    method: 'post',
    data: {
      id,
      remark,
    },
  });
}
