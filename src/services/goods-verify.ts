// @ts-ignore
/* eslint-disable */
import Common from '@/types/common';
import GoodsVerify from '@/types/goods-verify';
import { request } from 'umi';

/** 获取 列表 */
export async function getGoodsVerifyPage(data?: { [key: string]: any }) {
  return request<GoodsVerify.ResultList>('/antelope-pay/mng/apply/queryAppPage', {
    method: 'post',
    data,
    // headers: {
    //   'rpc-tag': 'jbxu5',
    // },
  });
}

/**
 * 更新状态
 */
export async function updateVerityStatus(data: {
  id: string | undefined;
  handleResult: number;
  handleReason: string;
}) {
  return request<Common.ResultCode>('/antelope-pay/mng/apply/handleApply', {
    method: 'post',
    data,
    // headers: {
    //   'rpc-tag': 'jbxu5',
    // },
  });
}
/**
 * 运营平台获取省市
 * @param data
 * @returns
 */
export async function getDetail(data: { productId: string }) {
  return request<
    Common.ResultCode & {
      result: any;
    }
  >('/antelope-pay/mng/apply/queryAppProductDetail', {
    method: 'get',
    params: { ...(data || {}) },
    // headers: {
    //   'rpc-tag': 'jbxu5',
    // },
  });
}
