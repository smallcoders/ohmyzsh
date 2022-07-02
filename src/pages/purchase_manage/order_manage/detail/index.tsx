import { message, Image, Button, Radio, Space } from 'antd';
import { history } from 'umi';
import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import scopedClasses from '@/utils/scopedClasses';
import './index.less';
import { exportOrder, getOrderDetail } from '@/services/order/order-manage';
import OrderManage from '@/types/order/order-manage';
import { FieldTimeOutlined, UploadOutlined } from '@ant-design/icons';
import OrderList, { ButtonManage } from '../components/order-list';
import { dateFormat } from '@/utils/date';

const sc = scopedClasses('order-manage-detail');

export default () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [detail, setDetail] = useState<OrderManage.Content>({});
  const [type, setType] = useState<number>(1);

  const prepare = async () => {
    const infoType = history.location.query?.type as string;
    const id = history.location.query?.id as string;

    if (infoType) {
      setType(Number(infoType));
    }
    if (id) {
      try {
        const res = await getOrderDetail(id);
        if (res.code === 0) {
          setDetail(res.result);
        } else {
          throw new Error(res.message);
        }
      } catch (error) {
        message.error('服务器错误');
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    prepare();
  }, []);

  const toHourMinute = (minutes = 0) => {
    return Math.floor(minutes / 60) + '小时' + (minutes % 60) + '分钟';
  };

  const copy = (text = '') => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    navigator &&
      navigator.clipboard &&
      navigator.clipboard.writeText(text).then(() => {
        message.success('复制成功');
      });
  };

  const onExport = async () => {
    try {
      const res = await exportOrder(detail?.orderNo || '');

      const a = document.createElement('a');
      const href = window.URL.createObjectURL(new Blob([res]));
      a.href = href;
      a.download = `订单列表.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(href);
      message.success(`导出成功`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <PageContainer className={sc('container')} loading={loading}>
      <div className={sc('container-operate')}>
        <div>
          <div className={sc('container-desc')}>
            <span>当前就订单状态：</span>
            <Space size={10}>
              {OrderManage.StateJson[detail?.state || ''] || '--'}
              <span
                style={{
                  background: '#FFE0E2',
                  color: '#FF6680',
                  borderRadius: '2px',
                  padding: '0 10px',
                }}
              >
                {OrderManage.PayTypeJson[detail?.payMethod || ''] || '--'}
              </span>
              <FieldTimeOutlined
                style={{
                  color: '#FF6680',
                }}
              />
              <span
                style={{
                  color: '#FF6680',
                }}
              >
                {toHourMinute(detail?.expireMin)}后，系统将关闭交易
              </span>
            </Space>
          </div>
          <div className={sc('container-desc')}>
            {detail?.state == 6 ? (
              <>
                <span>交易关闭原因：</span>
                <span>退货退款完成</span>
              </>
            ) : (
              <>
                <span>交易操作：</span>
                <Space size={10}>
                  {detail?.mngButtonList?.map((b) => {
                    return <ButtonManage type={b as any} record={detail} callback={prepare} />;
                  })}
                </Space>
              </>
            )}
          </div>
        </div>
        <Button
          href={`/antelope-pay/mng/order/detail/export?orderNo=${detail?.orderNo}`}
          icon={<UploadOutlined />}
          // onClick={() => {
          //   onExport();
          // }}
        >
          导出
        </Button>
      </div>

      <div className={sc('container-info')}>
        <Radio.Group value={type} onChange={(e) => setType(e.target.value)}>
          <Radio.Button value={1}>订单信息</Radio.Button>
          <Radio.Button value={2}>发票信息</Radio.Button>
        </Radio.Group>

        {type === 1 && (
          <>
            <div className="order">
              <div style={{ flex: 1 }}>
                <div className={sc('container-desc')}>
                  <span>订单编号：</span>
                  <Space size={10}>
                    <span>{detail?.orderNo}</span>
                    <a
                      onClick={() => {
                        copy(detail?.orderNo);
                      }}
                    >
                      复制
                    </a>
                  </Space>
                </div>

                <div className={sc('container-desc')}>
                  <span>下单手机号：</span>
                  <span>{detail?.userPhone}</span>
                </div>

                <div className={sc('container-desc')}>
                  <span>收货人：</span>
                  <span>{detail?.consignee}</span>
                </div>

                <div className={sc('container-desc')}>
                  <span>收货电话：</span>
                  <span>{detail?.consigneePhone}</span>
                </div>

                <div className={sc('container-desc')}>
                  <span>收货地址：</span>
                  <span>
                    {detail?.province}/{detail?.city}/{detail?.district} {detail?.addressDetail}
                  </span>
                </div>

                <div className={sc('container-desc')}>
                  <span>订单备注：</span>
                  <span>{detail?.remark}</span>
                </div>
              </div>

              <div style={{ flex: 3 }}>
                <div className={sc('container-desc')}>
                  <span>下单时间：</span>
                  <span>{dateFormat(detail?.createTime)}</span>
                </div>
                <div className={sc('container-desc')}>
                  <span>付款时间：</span>
                  <span>{dateFormat(detail?.payTime)}</span>
                </div>
                <div className={sc('container-desc')}>
                  <span>发货时间：</span>
                  <span>
                    {dateFormat(detail?.shipTime)}（发货数量：{detail?.shipNum}）
                  </span>
                </div>
                <div className={sc('container-desc')}>
                  <span>成交时间：</span>
                  <span>{dateFormat(detail?.endTime)}</span>
                </div>
              </div>
            </div>
            <OrderList type="PRODUCT" dataSource={[detail] || []} callback={prepare} />
          </>
        )}
        {type === 2 && (
          <div className="invoice">
            <h1>等待开票</h1>
            <h4>开票申请信息</h4>
            <div>
              <div className="invoice-desc">
                <span>发票形式：</span>
                <span>{detail?.invoiceFormName}</span>
              </div>

              <div className="invoice-desc">
                <span>收票邮箱：</span>
                <span>{detail?.mail}</span>
              </div>

              <div className="invoice-desc">
                <span>发票类型：</span>
                <span>{detail?.invoiceType}</span>
              </div>
              <div className="invoice-desc">
                <span>抬头名称：</span>
                <span>{detail?.orgName}</span>
              </div>

              <div className="invoice-desc">
                <span>税号：</span>
                <span>{detail?.orgTaxNo}</span>
              </div>

              <div className="invoice-desc">
                <span>公司地址：</span>
                <span>{detail?.orgAddress}</span>
              </div>
              <div className="invoice-desc">
                <span>电话号码：</span>
                <span>{detail?.orgPhone}</span>
              </div>

              <div className="invoice-desc">
                <span>开户银行：</span>
                <span>{detail?.orgBankName}</span>
              </div>

              <div className="invoice-desc">
                <span>银行账号：</span>
                <span>{detail?.orgBackAccount}</span>
              </div>
            </div>
            {detail?.invoiceCreateTime && (
              <>
                <h4>开票申请信息</h4>
                {detail?.invoiceCancelTime && (
                  <div className={sc('container-desc')}>
                    <span>{dateFormat(detail?.invoiceCancelTime)}</span>
                    <span>系统取消开票</span>
                  </div>
                )}
                <div className={sc('container-desc')}>
                  <span>{dateFormat(detail?.invoiceCreateTime)}</span>
                  <span>买家申请开票</span>
                </div>{' '}
              </>
            )}
          </div>
        )}
      </div>
    </PageContainer>
  );
};
