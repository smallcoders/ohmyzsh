import OrderManage from '@/types/order/order-manage';
import { Popconfirm, message } from 'antd';

import { history } from 'umi';
import { routeName } from '@/../config/routes';
import {
  applyRefund
} from '@/services/order/order-manage';
import './index.less';

import { dateFormat } from '@/utils/date';

export const ButtonManage = ({
  record,
  type,
  callback,
}: {
  record: OrderManage.Content;
  type: string;
  callback: () => void;
}) => {
  const applyReturn = async () => {
    const tooltipMessage = '申请退货'
    console.log(record.orderNo, 999)
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

  return (
    {
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
  record = {},
  type = 'ORDER',
  callback,
}: {
  record: OrderManage.Content;
  type: string;
  callback: () => void;
}) => {
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
          {record?.list?.map((p: any, index: number) => (
            <div
              key={index}
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
                  <div>
                    <span style={{ color: 'rgba(0, 0, 0, 0.45)' }}>规格：</span>
                    <span>{p?.specVoList?.[0]?.specValue}</span>
                  </div>
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
                  {record?.payMethod?.indexOf('ZDY_') > -1 ? record?.payMethod?.substring(4) : OrderManage.PayTypeJson[record?.payMethod || ''] || '在线支付'}
                </span>
              </div>
              <div style={{ flex: 1, display: 'grid', textAlign: 'center' }}>
                <span>{OrderManage.StateJsonInOrderDetail[record?.state || ''] || '--'}</span>
                {record?.state == 6 && <span style={{ color: '#999' }}>{record?.remarkMsg}</span>}

                <a
                  onClick={() => {
                    history.push(`${routeName.ORDER_MESSAGE_DETAIL}?id=${record.orderNo}`);
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
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

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
        {dataSource?.map((item, i) => (
          <OrderItem key={i} type={type} record={item} callback={callback} />
        ))}
      </div>
    </div>
  );
};
