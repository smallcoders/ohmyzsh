import { UploadOutlined } from '@ant-design/icons';
import { Button, Input, Form, Select, Row, Col, DatePicker, message, Pagination } from 'antd';
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
  // const [loading, setLoading] = useState<boolean>(false);
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

  const getPage = async (pageIndex: number = 1, pageSize = pageInfo.pageSize) => {
    try {
      const { result, totalCount, pageTotal, code } = await getOrderPage({
        pageIndex,
        pageSize,
        ...searchContent,
      });
      if (code === 0) {
        setPageInfo({ totalCount, pageTotal, pageIndex, pageSize });
        setDataSource(result);
      } else {
        message.error(`请求分页数据失败`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPage();
  }, [searchContent]);

  const useSearchNode = (): React.ReactNode => {
    const [searchForm] = Form.useForm();
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
                key="primary"
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
                key="primary"
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

  return (
    <PageContainer className={sc('container')}>
      {useSearchNode()}
      <div className={sc('container-table-header')}>
        <div className="title">
          <span>订单列表(共{pageInfo.totalCount || 0}个)</span>
          <Button
            href={getUrl('/antelope-pay/mng/order/exportOrderList', {
              ...searchContent,
              pageIndex: 1,
              pageSize: 10000,
            })}
            icon={<UploadOutlined />}
            // onClick={() => {
            //   onExport();
            // }}
          >
            导出
          </Button>
        </div>
      </div>
      <div className={sc('container-table-body')}>
        <OrderList
          dataSource={dataSource}
          type={'ORDER'}
          callback={() => {
            getPage();
          }}
        />
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
      </div>
    </PageContainer>
  );
};
