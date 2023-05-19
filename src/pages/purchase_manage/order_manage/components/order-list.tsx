import OrderManage from '@/types/order/order-manage';
import { EditTwoTone, QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Empty, Input, InputNumber, message, Popconfirm, Radio, Tooltip, Modal } from 'antd';
import { useCallback, useRef, useState } from 'react';
import { Access, useAccess } from 'umi';
import { routeName } from '@/../config/routes';
import './index.less';
import {
  cancelOrder,
  ensureShip,
  applyRefund,
  getOrderLog,
  sendShip,
  updateOrderRemark,
  updateOrderState,
} from '@/services/order/order-manage';
import { dateFormat } from '@/utils/date';
export default ({
  dataSource,
  type = 'ORDER',
  callback,
}: {
  dataSource: any[];
  type: string;
  callback: () => void;
}) => {
  return (
    <div className="order-list-page">
      <div className="order-list-page-header">
        <div style={{ flex: 1 }}>
          <div style={{ flex: 4 }}>货品</div>
          <div style={{ flex: 3 }}>订货编码</div>
          <div style={{ flex: 2 }}>单价（元）</div>
          <div style={{ flex: 1 }}>数量</div>
        </div>
        <div style={{ flex: 1 }}>
          {type === 'PRODUCT' && (
            <>
              <div style={{ flex: 1, textAlign: 'center' }}>货品总量</div>
              <div style={{ flex: 1, textAlign: 'center' }}>运费</div>
            </>
          )}
          <div style={{ flex: 1, textAlign: 'center' }}>应付总额（元）</div>
          {type === 'ORDER' && (
            <>
              <div style={{ flex: 1, textAlign: 'center' }}>订单状态</div>
              <div style={{ flex: 1, textAlign: 'center' }}>交易操作</div>
            </>
          )}
        </div>
      </div>
      <div className="order-list-page-body">
        {dataSource?.map((item) => (
          <OrderItem type={type} record={item} callback={callback} />
        ))}
      </div>
    </div>
  );
};

export const ButtonManage = ({
  record,
  type,
  callback,
}: {
  record: OrderManage.Content;
  type: string;
  callback: () => void;
}) => {
  const [sendType, setSendType] = useState<number>();
  const [sendContent, setSendContent] = useState<number>(1);
  const [closeType, setCloseType] = useState<number>();
  const [closeContent, setCloseContent] = useState<string>('');
  const [isShow, setIsShow] = useState<boolean>(false)

  const collection = async () => {
    const tooltipMessage = '确认收款';
    try {
      const result = await updateOrderState({
        orderNo: record?.orderNo,
        orderState: 3,
      });
      if (result.code === 0) {
        message.success(`${tooltipMessage}成功`);
        callback();
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      message.error(`${tooltipMessage}失败，原因:{${error}}`);
    }
  };

  const receiveGoods = async () => {
    const tooltipMessage = '确认收货';
    try {
      const result = await updateOrderState({
        orderNo: record?.orderNo,
        orderState: 9,
      });
      if (result.code === 0) {
        message.success(`${tooltipMessage}成功`);
        callback();
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      message.error(`${tooltipMessage}失败，原因:{${error}}`);
    }
  };

  const applyReturn = async () => {
    const tooltipMessage = '申请退货'
    try {
      const result = await applyRefund({
        orderNo: record?.orderNo
      })
      if (result.code === 0) {
        message.success(`${tooltipMessage}成功`)
        callback()
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      message.error(`${tooltipMessage}失败，原因:{${error}}`)
    }
  }

  const deliverGoods = async () => {
    const tooltipMessage = '发货';
    try {
      const result = await sendShip({
        orderNo: record?.orderNo,
        shipType: sendType,
        shipNum: sendContent,
      });
      if (result.code === 0) {
        message.success(`${tooltipMessage}成功`);
        callback();
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      message.error(`${tooltipMessage}失败，原因:{${error}}`);
    }
  };

  const cancel = async () => {
    const tooltipMessage = '交易关闭';
    try {
      const result = await cancelOrder({
        orderNo: record?.orderNo,
        msg: closeType == 0 ? '退货/退款完成' : closeContent,
      });
      if (result.code === 0) {
        message.success(`${tooltipMessage}成功`);
        callback();
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      message.error(`${tooltipMessage}失败，原因:{${error}}`);
    }
  };

  const access = useAccess()

  return (
    {
      1: (
        <Access accessible={access['P_PM_DD']}>
          <Popconfirm
            icon={null}
            title={
              <div style={{ display: 'grid', gap: 10, marginBottom: 10 }}>
                <span>请选择交易关闭原因</span>
                <Radio.Group
                  onChange={(e) => {
                    setCloseType(e.target.value);
                  }}
                  value={closeType}
                >
                  <Radio value={0}>退货/退款完成</Radio>
                  <Radio value={1}>其他</Radio>
                </Radio.Group>
                {closeType == 1 && (
                  <Input.TextArea
                    onChange={(e) => setCloseContent(e.target.value)}
                    value={closeContent}
                    showCount
                    maxLength={20}
                  />
                )}
              </div>
            }
            okText="确定"
            cancelText="取消"
            onConfirm={() => cancel()}
          >
            <Button type="link">交易关闭</Button>
          </Popconfirm>
        </Access>
      ),
      6: (
        <Access accessible={access['P_PM_DD']}>
          <Popconfirm
            title={
              <>
                <span>确认用户已收到货了吗</span>
                <span>共{record?.totalShipNum}件商品</span>
              </>
            }
            okText="确定"
            cancelText="取消"
            onConfirm={() => receiveGoods()}
          >
            <Button type="link">确认收货</Button>
          </Popconfirm>
        </Access>
      ),
      7: (
        <Access accessible={access['P_PM_DD']}>
          <Popconfirm
            title={`确认收到该订单¥${(record?.totalPrice || 0) / 100}转账货款`}
            okText="确定"
            cancelText="取消"
            onConfirm={() => collection()}
          >
            <Button type="link">确认收到货款</Button>
          </Popconfirm>
        </Access>
      ),
      8: (
        <Access accessible={access['P_PM_DD']}>
          <Popconfirm
            icon={null}
            title={
              <div
                style={{
                  display: 'flex',
                  padding: 10,
                }}
              >
                <div
                  style={{
                    display: 'grid',
                    gap: 10,
                  }}
                >
                  <span>请选择发货情况</span>
                  <Radio.Group
                    onChange={(e) => {
                      setSendType(e.target.value);
                    }}
                    value={sendType}
                  >
                    <Radio value={0}>
                      {(record?.shipNum || 0) > 0 ? '剩余全部发货' : '全部发货'}
                    </Radio>
                    <Radio value={1}>部分发货</Radio>
                  </Radio.Group>
                  {sendType == 1 && (
                    <InputNumber
                      onChange={(e) => setSendContent(e)}
                      value={sendContent}
                      min={1}
                      max={record?.unShipNum}
                    />
                  )}
                </div>

                <div style={{ wordBreak: 'keep-all' }}>
                  <div>
                    <span style={{ color: '#999' }}>已发货数量：</span>
                    <span style={{ color: '#000' }}>{record?.shipNum}</span>
                  </div>
                  <div>
                    <span style={{ color: '#999' }}>未发货数量：</span>
                    <span style={{ color: '#FF6680' }}>{record?.unShipNum}</span>
                  </div>
                </div>
              </div>
            }
            okText="确定"
            cancelText="取消"
            onConfirm={() => deliverGoods()}
          >
            <Button type="link">发货</Button>
          </Popconfirm>
        </Access>
      ),
      10: (
        <Popconfirm
          icon={null}
          title={
            <div className="sending-confirm-modal">
              <h3>确认退货</h3>
              <span>退货后，货款将退回消费券余额中，应用将不可再使用</span>
            </div>
          }
          okText="确定"
          cancelText="取消"
          onConfirm={() => applyReturn()}
        >
          <a>申请退货</a>
        </Popconfirm>
      ),
    }[type] || <span />
  );
};

export const OrderItem = ({
  record,
  type = 'ORDER',
  callback,
}: {
  record: OrderManage.Content;
  type: string;
  callback: () => void;
}) => {
  const [remark, setRemark] = useState<string>('');
  const [operations, setOperations] = useState<any[]>([]);

  const updRemark = async () => {
    const tooltipMessage = '修改';
    try {
      const result = await updateOrderRemark({
        orderNo: record?.orderNo,
        manageRemark: remark,
      });
      if (result.code === 0) {
        message.success(`${tooltipMessage}成功`);
        callback();
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      message.error(`${tooltipMessage}失败，原因:{${error}}`);
    }
  };

  const getOperate = async () => {
    try {
      const { result } = await getOrderLog({ orderNo: record?.orderNo });
      setOperations(result);
    } catch (error) {
      message.error(`查询操作记录失败`);
    }
  };

  const access = useAccess()

  return (
    <div className="order-item">
      {type === 'ORDER' && (
        <div className="order-item-header">
          <div style={{ color: 'rgba(0, 0, 0, 0.45)', fontSize: '12px' }}>
            <span> 订单编号：{record?.orderNo || '--'} </span>
            <span style={{ marginLeft: 10 }}> {dateFormat(record?.createTime) || '--'} </span>|
            下单手机号：
            {record?.userPhone || '--'}
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <span>{record.mngRemark}</span>
            <Access accessible={access['P_PM_DD']}>
              <Popconfirm
                icon={null}
                title={
                  <>
                    <Input.TextArea
                      placeholder="可在此填写备注内容，备注非必填"
                      onChange={(e) => setRemark(e.target.value)}
                      value={remark}
                      showCount
                      maxLength={30}
                    />
                  </>
                }
                okText="确定"
                cancelText="取消"
                onConfirm={() => updRemark()}
              >
                <EditTwoTone
                  onClick={() => {
                    setRemark(record.mngRemark || '');
                  }}
                />
                <a href="javascript:void(0)">备注</a>
              </Popconfirm>
            </Access>
          </div>
        </div>
      )}
      <div className="order-item-body">
        <div
          style={{
            flex: 1,
            display: 'grid',
            alignItems: 'center',
            borderRight: '1px solid #D9D9D9',
          }}
        >
          {record?.list?.map((p, index) => (
            <div
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                borderBottom: index === record?.list?.length - 1 ? 'none' : '1px solid #D9D9D9',
              }}
            >
              <div
                style={{
                  flex: 4,
                  display: 'flex',
                  gap: 10,
                  padding: 5,
                }}
              >
                <div className="image">
                  <img src={p.productPic} alt="商品图片" />
                </div>
                <div style={{ display: 'grid' }}>
                  <span
                    style={{
                      fontWeight: 'bold',
                      color: 'rgba(0, 0, 0, 0.85)',
                      lineHeight: '20px',
                    }}
                  >
                    {p.productName}
                  </span>
                  {p?.specVoList?.map((spec) => (
                    <div>
                      <span style={{ color: 'rgba(0, 0, 0, 0.45)' }}>{spec.spec}</span>
                      <span>{spec.specValue}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ flex: 3 }}>{p.productNo}</div>
              <div style={{ flex: 2 }}>¥{(p?.salePrice || 0) / 100}</div>
              <div style={{ flex: 1 }}>{p.amount}</div>
            </div>
          ))}
        </div>
        <div style={{ flex: 1, display: 'flex' }}>
          {type === 'PRODUCT' && (
            <>
              <div style={{ flex: 1, textAlign: 'center' }}>{record?.totalShipNum || 0}</div>
              <div style={{ flex: 1, textAlign: 'center' }}>￥{(record?.shipPrice || 0) / 100}</div>
              <div style={{ flex: 1, textAlign: 'center' }}>
                ￥{(record?.totalPayPrice || 0) / 100}
              </div>
            </>
          )}

          {type === 'ORDER' && (
            <>
              <div
                style={{
                  flex: 1,
                  display: 'grid',
                  alignItems: 'center',
                  justifyItems: 'center',
                  alignContent: 'center',
                }}
              >
                <span>¥{(record?.totalPrice || 0) / 100}</span>
                <span
                  style={{
                    background: '#FFE0E2',
                    color: '#FF6680',
                    borderRadius: '2px',
                    padding: '0 10px',
                  }}
                >
                  {OrderManage.PayTypeJson[record?.payMethod || ''] || '在线支付'}
                </span>
              </div>
              <div style={{ flex: 1, display: 'grid', textAlign: 'center' }}>
                <span>{OrderManage.StateJson[record?.state || ''] || '--'}</span>
                {record?.state == 6 && <span style={{ color: '#999' }}>{record?.remarkMsg}</span>}
                {record?.state == 3 && (
                  <div style={{ display: 'grid' }}>
                    <div>
                      <span style={{ color: '#999' }}>已发货数量：</span>
                      <span style={{ color: '#000' }}>{record?.shipNum}</span>
                    </div>
                    <div>
                      <span style={{ color: '#999' }}>未发货数量：</span>
                      <span style={{ color: '#FF6680' }}>{record?.unShipNum}</span>
                    </div>
                  </div>
                )}
                <a
                  onClick={() => {
                    window.open(`${routeName.PURCHASE_MANAGE_DETAIL}?id=${record.orderNo}`);
                  }}
                >
                  订单详情
                </a>
              </div>
              <div
                style={{ flex: 1, display: 'grid', textAlign: 'center', alignContent: 'center' }}
              >
                {record?.mngButtonList?.map((b) => {
                  return <ButtonManage type={b as any} record={record} callback={callback} />;
                })}
                {/* <span>交易关闭</span> */}
              </div>
            </>
          )}
        </div>
        {type === 'ORDER' && (
          <Tooltip
            color={'#fff'}
            trigger="click"
            title={
              <div style={{ padding: 10, color: '#000' }}>
                {operations?.length === 0 ? (
                  <Empty />
                ) : (
                  <div>
                    {operations.map((p, index) => (
                      <div
                        style={{
                          display: 'flex',
                          gap: 20,
                          borderTop: index === 0 ? 'none' : '1px solid #ccc',
                        }}
                      >
                        <div style={{ color: '#6680FF', alignSelf: 'center' }}>
                          {p.operateMsg}
                          {p.operateType == 2 && `（${p.shipNum}）`}
                        </div>
                        <div style={{ display: 'grid', justifyItems: 'center' }}>
                          <span>{p.operateUserName}</span>
                          <span>{dateFormat(p.createTime)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            }
          >
            <div
              style={{
                position: 'absolute',
                right: 10,
                bottom: 10,
                color: 'rgba(0, 0, 0, 0.65)',
                fontSize: '12px',
                display: 'flex',
                gap: '5px',
                alignItems: 'center',
                cursor: 'pointer',
              }}
              onClick={() => getOperate()}
            >
              <QuestionCircleOutlined />
              查看交易操作记录
            </div>
          </Tooltip>
        )}
      </div>
    </div>
  );
};
