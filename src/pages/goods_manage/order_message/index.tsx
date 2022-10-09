import { UploadOutlined } from '@ant-design/icons';
import type { RadioChangeEvent } from 'antd';
import {
  Button,
  Input,
  Form,
  Select,
  Row,
  Col,
  DatePicker,
  message,
  Pagination,
  Radio,
  Empty,
  Spin,
} from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import React, { useEffect, useState } from 'react';
import type Common from '@/types/common';
import moment from 'moment';
import OrderList from './components/order-list';
import './index.less';
import scopedClasses from '@/utils/scopedClasses';
import OrderManage from '@/types/order/order-manage';
import { getOrderPage } from '@/services/order/order-manage';
import { getUrl } from '@/utils/util';
const sc = scopedClasses('order-manage');

export default () => {
  const [dataSource, setDataSource] = useState<OrderManage.Content[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchContent, setSearChContent] = useState<{
    title?: string; // 标题
    publishTime?: string; // 发布时间
    state?: number; // 状态：0发布中、1待发布、2已下架
  }>({});

  const formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };

  const [pageInfo, setPageInfo] = useState<Common.ResultPage>({
    pageIndex: 1,
    pageSize: 20,
    totalCount: 0,
    pageTotal: 0,
  });
  const [state, setState] = useState<number>(0);
  const [searchForm] = Form.useForm();

  useEffect(() => {
    if (state !== 0) {
      searchForm.resetFields();
    }
    setSearChContent({});
  }, [state]);

  const getPage = async (pageIndex: number = 1, pageSize = pageInfo.pageSize) => {
    setLoading(true);
    try {
      const { result, totalCount, pageTotal, code } = await getOrderPage({
        pageIndex,
        pageSize,
        orderState: state === 0 ? undefined : state,
        type: 1, //订单类型   0-采购订单 1:数字化应用订单
        ...searchContent,
      });
      if (code === 0) {
        setPageInfo({ totalCount, pageTotal, pageIndex, pageSize });
        setDataSource(result);
      } else {
        message.error(`请求分页数据失败`);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error(error);
    }
  };

  useEffect(() => {
    getPage();
  }, [searchContent]);
  const useSearchNode = (): React.ReactNode => {
    return (
      <div className={sc('container-search')}>
        <Form {...formLayout} form={searchForm}>
          <Row>
            <Col span={6}>
              <Form.Item name="orderNo" label="订单编号">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="orderMobile" label="手机号">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="productName" label="商品名称">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="specProNo" label="订货编码">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item name="payMethod" label="支付方式">
                <Select placeholder="请选择" allowClear>
                  {Object.entries(OrderManage.PayTypeJson).map((p) => (
                    <Select.Option key={p[0] + p[1]} value={p[0]}>
                      {p[1]}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="orderState" label="订单状态">
                <Select placeholder="请选择" allowClear>
                  {Object.entries(OrderManage.StateJson).map((p) => (
                    <Select.Option key={p[0] + p[1]} value={p[0]}>
                      {p[1]}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="time" // beginPublishTime  endPublishTime
                label="订单生成时间"
              >
                <DatePicker.RangePicker allowClear showTime />
              </Form.Item>
            </Col>
            <Col offset={3} span={3}>
              <Button
                style={{ marginRight: 20 }}
                type="primary"
                key="search"
                onClick={() => {
                  const search = searchForm.getFieldsValue();
                  if (search.time) {
                    search.createTimeStart = moment(search.time[0]).format('YYYY-MM-DD HH:mm:ss');
                    search.createTimeEnd = moment(search.time[1]).format('YYYY-MM-DD HH:mm:ss');
                  }
                  setSearChContent(search);
                }}
              >
                查询
              </Button>
              <Button
                type="primary"
                key="reset"
                onClick={() => {
                  searchForm.resetFields();
                  setSearChContent({});
                }}
              >
                重置
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    );
  };

  /**
   * 切换 app、小程序、pc
   * @returns React.ReactNode
   */
  const selectButton = (): React.ReactNode => {
    const handleEdgeChange = (e: RadioChangeEvent) => {
      setState(e.target.value);
      // getBanners()
    };
    return (
      <Radio.Group value={state} onChange={handleEdgeChange} style={{ marginBottom: 20 }}>
        <Radio.Button value={0}>全部</Radio.Button>
        <Radio.Button value={1}>待付款</Radio.Button>
        <Radio.Button value={3}>待发货</Radio.Button>
        <Radio.Button value={4}>待收货</Radio.Button>
        <Radio.Button value={26}>已完成</Radio.Button>
      </Radio.Group>
    );
  };

  return (
    <PageContainer className={sc('container')}>
      {selectButton()}
      {state === 0 && useSearchNode()}
      <div className={sc('container-table-header')}>
        <div className="title">
          <span>订单列表(共{pageInfo.totalCount || 0}个)</span>
          {/* <Button
            href={getUrl('/antelope-pay/mng/order/exportOrderList', {
              ...searchContent,
              pageIndex: 1,
              pageSize: 10000,
            })}
            icon={<UploadOutlined />}
      
          >
            导出
          </Button> */}
        </div>
      </div>
      <Spin wrapperClassName={sc('container-table-body')} spinning={loading}>
        {dataSource.length === 0 ? (
          <Empty />
        ) : (
          <OrderList
            dataSource={dataSource}
            type={'ORDER'}
            callback={() => {
              getPage();
            }}
          />
        )}

        <div
          style={{
            padding: 20,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {/* <span>
            共{pageInfo.totalCount}条记录 第{pageInfo.pageIndex}/{pageInfo.pageTotal}页
          </span> */}
          <Pagination
            current={pageInfo.pageIndex}
            pageSize={pageInfo.pageSize}
            total={pageInfo.totalCount}
            showSizeChanger
            showQuickJumper
            onChange={getPage}
            onShowSizeChange={getPage}
          />
        </div>
      </Spin>
    </PageContainer>
  );
};
