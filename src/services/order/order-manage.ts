// @ts-ignore
/* eslint-disable */
import Common from '@/types/common';
import OrderManage from '@/types/order/order-manage';
import { request } from 'umi';

/** 订单分页 */
export async function getOrderPage(data?: { [key: string]: any }) {
  return request<OrderManage.ResultList>('/antelope-pay/mng/order/query', {
    method: 'post',
    data,
    
  });
}

/**
 * 导出订单
 * @param data
 * @returns
 */
export async function exportOrder(orderNo: string) {
  return request<any>('/antelope-pay/mng/order/detail/export', {
    method: 'GET',
    params: { orderNo },
  });
}

/**
 * 导出列表
 * @param data
 * @returns
 */
export async function exportOrderList(data?: { [key: string]: any }) {
  return request<any>('/antelope-pay/mng/order/exportOrderList', {
    method: 'post',
    data,
  });
}

/**
 * 获取订单详情
 * @param data
 * @returns
 */
export async function getOrderDetail(orderNo: string) {
  return request<any>('/antelope-pay/mng/order/detail', {
    method: 'GET',
    params: { orderNo },
  });
}

/**
 * 确认收到货款
 */
export async function updateOrderState(data?: { [key: string]: any }) {
  return request<any>('/antelope-pay/mng/order/modify/state', {
    method: 'Post',
    data,
  });
}

/**
 * 发货
 * @param data
 * @returns
 */
export async function sendShip(data?: { [key: string]: any }) {
  return request<any>('/antelope-pay/mng/order/ship', {
    method: 'post',
    data,
  });
}

/**
 * 交易关闭
 * @param data
 * @returns
 */
export async function cancelOrder(data?: { [key: string]: any }) {
  return request<any>('/antelope-pay/mng/order/cancel', {
    method: 'post',
    data,
  });
}

/**
 * 更新备注
 * @param data
 * @returns
 */
export async function updateOrderRemark(data?: { [key: string]: any }) {
  return request<any>('/antelope-pay/mng/order/add/remark', {
    method: 'post',
    data,
  });
}

/**
 *
 * 获取订单操作日志
 * @param params
 * @returns
 */
export async function getOrderLog(params?: { [key: string]: any }) {
  return request<any>('/antelope-pay/mng/log', {
    method: 'GET',
    params,
  });
}

export async function getOrderSource() {
  return request<any>('/antelope-pay/mng/order/payMethod', {
    method: 'POST',
    
  });
}

export async function getOrderNum(tmpId: string) {
  return request<any>(`/antelope-pay/mng/activity/app/orderNum?tmpId=${tmpId}`, {
    method: 'POST',
  });
}

// 数字化应用商品管理-商品管理
/**
 * 分页查询
 * @param params
 */
export async function pageQuery(data: any) {
  return request<any>(
    '/antelope-pay/mng/product/productManage/page',
    {
      method: 'POST',
      data: { ...data, pageIndex: data.current },
    },
  );
}

/**
 * 修改权重
 * @param params
 */
export async function modifySortNo(data: any) {
  return request<any>(
    '/antelope-pay/mng/product/productManage/modify',
    {
      method: 'PUT',
      data
    },
  );
}

/**
 * 修改标签
 * @param params
 */
export async function modifyTags(data: any) {
  return request<any>(
    '/antelope-pay/mng/product/productManage/modifyTags',
    {
      method: 'POST',
      data
    },
  );
}

/**
 * 申请退货
 * @param data
 * @returns
 */
export async function applyRefund(params?: { [key: string]: any }) {
  return request<any>('/antelope-pay/mng/order/refund', {
    method: 'get',
    params
  });
}

