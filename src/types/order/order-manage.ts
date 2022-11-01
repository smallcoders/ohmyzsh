import type Common from '../common';

// eslint-disable-next-line @typescript-eslint/no-namespace
namespace OrderManage {
  export const StateJson = {
    '25': '订单待确认',
    // '1': '未支付',
    '3': '已支付',
    '4': '已发货',
    '6': '交易关闭',
    '5': '交易成功',
  };
  export const StateJsonInOrderDetail = {
    ...StateJson,
    '1': '订单待确认',
  };
  export const PayTypeJson = {
    P01: '微信',
    P02: '支付宝',
    P03: '银联',
    P04: '对公转账',
  };

  export type ResultList = {
    result: Content[];
  } & Common.ResultCode &
    Common.ResultPage;

  export type Content = {
    actNo?: string; //	活动编号
    actName?: string; //	活动名称
    consignee?: string; //	订单收件人
    consigneePhone?: string; //	订单收件人手机
    country?: string; //	收获地址-国家
    province?: string; //	收获地址-省/直辖市
    city?: string; //	收获地址-城市
    district?: string; //	收获地址-县/区
    street?: string; // 街道
    addressDetail?: string; //	收获地址-详细地址
    orderNo?: string; //	订单号
    createTime?: string; //	订单创建时间
    shipTimeNumList?: any[]; // 发货时间
    payTime?: string; //	订单支付时间

    shipTime?: string; //	物流发货时间

    endTime?: string; //	物流结束时间

    userPhone?: string; //	用户下单手机号
    totalPrice?: number; //	订单总金额
    state?: number; //	订单状态
    stateMsg?: string; //	订单状态描述
    remark?: string; //	订单备注
    mngRemark?: string; // mngRemark
    remarkMsg?: string; //	其他备注点：超时自动取消、活动关闭、商品失效等
    expireMin?: number; //	自动关闭剩余分钟数
    productPic?: string; //	商品图片
    list?: any; //	子订单列表

    mail?: string; //	邮箱
    invoiceType?: number; //	发票类型 0-普通发票1-专用发票
    invoiceForm?: number; //	发票形式 0-电子发票  1-纸质发票
    orgName?: string; //	企业名称
    orgTaxNo?: string; //	单位税号
    orgAddress?: string; //	公司地址
    orgPhone?: string; //	公司电话
    orgBankName?: string; //	开户银行
    orgBackAccount?: string; //	银行账户
    invoiceTypeName?: string; //	发票类型名称
    invoiceFormName?: string; //	发票形式名称
    shipAddressDetail?: string; //	收获地址详情，收获地址各字段拼接成
    invoiceAddress?: any; // 收件人信息
    payMethod?: string; //	支付方式
    taxPrice?: number; //	税费价格
    shipPrice?: number; //	运费价格
    shipNum?: number; //	已发货数量
    unShipNum?: number; //	剩余未发货数量
    totalShipNum?: number; //	总件数
    totalTypeNum?: number; //	总种类数
    totalPayPrice?: number; //	总支付金额：含税金额+运费金额
    buttonList?: number[]; //	订单button展示列表

    invoiceCreateTime?: string; //申请开票时间
    invoiceCancelTime?: string; //	取消开票时间
    invoiceTitleType?: string; //	抬头类型title
    // //取消订单
    // BUTTON_CANCEL(1),
    // //对公转账
    // BUTTON_PAY_PUB(2),
    // //申请开票
    // BUTTON_INVOICE(3),
    // //删除订单
    // BUTTON_DEL(4),
    // //在线支付
    // BUTTON_PAY_ONLINE(5),
    // //确认收获
    // BUTTON_RECEIVE(6),
    mngButtonList?: number[];
    invoiceNo?: string; //	发票编号
    remarkMsgReason?: string;
  };
}
export default OrderManage;
