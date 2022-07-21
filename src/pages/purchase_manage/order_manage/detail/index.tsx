import { message, Image, Button, Radio, Space, Breadcrumb } from 'antd';
import { history, Link } from 'umi';
import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import scopedClasses from '@/utils/scopedClasses';
import './index.less';
import { exportOrder, getOrderDetail } from '@/services/order/order-manage';
import OrderManage from '@/types/order/order-manage';
import { FieldTimeOutlined, UploadOutlined } from '@ant-design/icons';
import OrderList, { ButtonManage } from '../components/order-list';
import { dateFormat } from '@/utils/date';
import { routeName } from '../../../../../config/routes';

const sc = scopedClasses('order-manage-detail');

export default () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [detail, setDetail] = useState<OrderManage.Content>({});
  const [type, setType] = useState<number>(1);
  const infoType = history.location.query?.type as string;
  const id = history.location.query?.id as string;

  const prepare = async () => {
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

  const formatMinutes = (minutes = 0) => {
    const day = Math.floor(minutes / 1440);

    const hour = day > 0 ? Math.floor((minutes - day * 1440) / 60) : Math.floor(minutes / 60);

    const minute = hour > 0 ? Math.floor(minutes - day * 1440 - hour * 60) : minutes;

    let time = '';

    if (day > 0) time += day + '天';

    if (hour > 0) time += hour + '小时';

    if (minute > 0) time += minute + '分钟';

    return time;
  };

  const toHourMinute = (minutes = 0, payMethod = 'P04') => {
    if (payMethod == 'P04') {
      return formatMinutes(minutes);
    }
    const hour = Math.floor(minutes / 60);
    if (hour > 0) return hour + '小时' + (minutes % 60) + '分钟';
    return minutes + '分钟';
  };

  const copy = (text = '') => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    navigator &&
      navigator.clipboard &&
      navigator.clipboard.writeText(text).then(() => {
        message.success('复制成功');
      });
  };

  return (
    <PageContainer
      header={{
        title: '订单详情',
        breadcrumb: (
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to="/purchase-manage/commodity-manage">采购管理 </Link>
            </Breadcrumb.Item>

            <Breadcrumb.Item>
              {infoType ? (
                <Link to={routeName.BILL_MANAGEMENT}>发票管理 </Link>
              ) : (
                <Link to={routeName.PURCHASE_MANAGE}>订单管理 </Link>
              )}
            </Breadcrumb.Item>

            <Breadcrumb.Item>订单详情</Breadcrumb.Item>
          </Breadcrumb>
        ),
      }}
      className={sc('container')}
      loading={loading}
    >
      <div className={sc('container-operate')}>
        <div>
          <div className={sc('container-desc')}>
            <span>当前就订单状态：</span>
            <Space size={10}>
              {OrderManage.StateJson[detail?.state || ''] || '--'}
              {(detail?.state == 1 || detail?.state == 25) && (
                <>
                  <span
                    style={{
                      background: '#FFE0E2',
                      color: '#FF6680',
                      borderRadius: '2px',
                      padding: '0 10px',
                    }}
                  >
                    {OrderManage.PayTypeJson[detail?.payMethod || ''] || '在线支付'}
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
                    {toHourMinute(detail?.expireMin, detail?.payMethod)}后，系统将关闭交易
                  </span>
                </>
              )}
              {detail?.state == 3 && (
                <>
                  <div>
                    <span style={{ color: '#999' }}>已发货数量：</span>
                    <span style={{ color: '#000' }}>{detail?.shipNum}</span>
                  </div>
                  <div>
                    <span style={{ color: '#999' }}>未发货数量：</span>
                    <span style={{ color: '#FF6680' }}>{detail?.unShipNum}</span>
                  </div>
                </>
              )}
              {detail?.state == 6 && (
                <span style={{ color: '#999' }}>（{detail?.remarkMsgReason || '--'}）</span>
              )}
            </Space>
          </div>
          <div className={sc('container-desc')}>
            {detail?.state == 6 ? (
              <>
                <span>交易关闭原因：</span>
                <span>{detail?.remarkMsg || '无'}</span>
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
          {detail?.invoiceNo && <Radio.Button value={2}>发票信息</Radio.Button>}
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
                    {detail?.province}/{detail?.city}/{detail?.district}/{detail?.street}{' '}
                    {detail?.addressDetail}
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
                    {detail?.shipTimeNumList?.map((p) => (
                      <div>
                        {dateFormat(p?.sendTime || '')}（发货数量：{p?.shipNum || 0}）
                      </div>
                    ))}
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
              {detail?.invoiceFormName && (
                <div className="invoice-desc">
                  <span>发票形式：</span>
                  <span>{detail?.invoiceFormName}</span>
                </div>
              )}

              {detail?.invoiceForm == 0 && detail?.mail && (
                <div className="invoice-desc">
                  <span>收票邮箱：</span>
                  <span>{detail?.mail}</span>
                </div>
              )}

              {detail?.invoiceForm == 1 && (
                <>
                  {detail?.invoiceAddress && (
                    <div className="invoice-desc">
                      <span>发票收件人：</span>
                      <span>{detail?.invoiceAddress?.consignee}</span>
                    </div>
                  )}
                  {detail?.invoiceAddress && (
                    <div className="invoice-desc">
                      <span>收票人手机号：</span>
                      <span>{detail?.invoiceAddress?.consigneePhone}</span>
                    </div>
                  )}

                  {detail?.invoiceAddress && (
                    <div className="invoice-desc">
                      <span>收票地址：</span>
                      <span>
                        {detail?.invoiceAddress?.province}/{detail?.invoiceAddress?.city}/
                        {detail?.invoiceAddress?.district}/{detail?.invoiceAddress?.street}{' '}
                        {detail?.invoiceAddress?.addressDetail}
                      </span>
                    </div>
                  )}
                </>
              )}

              {detail?.invoiceTypeName && (
                <div className="invoice-desc">
                  <span>发票类型：</span>
                  <span>{detail?.invoiceTypeName}</span>
                </div>
              )}
              {detail?.invoiceType == 0 && detail?.invoiceTitleType && (
                <div className="invoice-desc">
                  <span>抬头类型：</span>
                  <span>{detail?.invoiceTitleType}</span>
                </div>
              )}

              {detail?.orgName && (
                <div className="invoice-desc">
                  <span>抬头名称：</span>
                  <span>{detail?.orgName}</span>
                </div>
              )}

              {detail?.orgTaxNo && (
                <div className="invoice-desc">
                  <span>税号：</span>
                  <span>{detail?.orgTaxNo}</span>
                </div>
              )}

              {detail?.orgAddress && (
                <div className="invoice-desc">
                  <span>公司地址：</span>
                  <span>{detail?.orgAddress}</span>
                </div>
              )}
              {detail?.orgPhone && (
                <div className="invoice-desc">
                  <span>电话号码：</span>
                  <span>{detail?.orgPhone}</span>
                </div>
              )}

              {detail?.orgBankName && (
                <div className="invoice-desc">
                  <span>开户银行：</span>
                  <span>{detail?.orgBankName}</span>
                </div>
              )}

              {detail?.orgBackAccount && (
                <div className="invoice-desc">
                  <span>银行账号：</span>
                  <span>{detail?.orgBackAccount}</span>
                </div>
              )}
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
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </PageContainer>
  );
};
