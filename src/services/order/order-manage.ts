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
