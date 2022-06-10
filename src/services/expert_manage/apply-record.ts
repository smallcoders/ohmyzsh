// @ts-ignore
/* eslint-disable */
import Common from '@/types/common';
import ApplyRecord from '@/types/expert_manage/apply-record';
import { request } from 'umi';

/** 获取专家管理下申请记录分页 */
export async function getApplyRecordPage(data?: { [key: string]: any }) {
  return request<ApplyRecord.RecordList>('/antelope-manage/expert/applyPage', {
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
export async function markApplyRecordContracted(id: string, remark: string) {
  return request<Common.ResultCode & { result: any }>(`/antelope-manage/expert/applyRemark`, {
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
  return request<Common.ResultCode & { result: any }>(`/antelope-manage/expert/applyRemarkEdit`, {
    method: 'post',
    data: {
      id,
      remark,
    },
  });
}
