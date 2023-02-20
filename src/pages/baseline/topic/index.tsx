import scopedClasses from '@/utils/scopedClasses';
import './index.less';
import { PageContainer } from '@ant-design/pro-layout';
import React, {useState} from "react";
import {Button, Col, Form, Input, Row, Select, Space} from "antd";
import type LogoutVerify from "@/types/user-config-logout-verify";
import SelfTable from "@/components/self_table";
import moment from "moment/moment";
import type Common from "@/types/common";

export default () => {
  const sc = scopedClasses('baseline-topic');
  const formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };
  const [searchForm] = Form.useForm();
  // const [dataSource, setDataSource] = useState<any>([]);
  const [pageInfo, setPageInfo] = useState<Common.ResultPage>({
    pageIndex: 1,
    pageSize: 10,
    totalCount: 1,
    pageTotal: 0,
  });
  const [searchContent, setSearChContent] = useState<any>({});
  const useSearchNode = (): React.ReactNode => {
    return (
      <div className={sc('container-search')}>
        <Form {...formLayout} form={searchForm}>
          <Row>
            <Col span={6}>
              <Form.Item name="topicName" label="话题名称">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="publisher" label="发布人">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="publishState" label="发布状态">
                <Select placeholder="请选择" allowClear style={{ width: '200px'}}>
                  <Select.Option value={0}>已发布</Select.Option>
                  <Select.Option value={1}>未发布</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Button
                style={{ margin:'0 20px' }}
                type="primary"
                key="search"
                onClick={() => {
                  const search = searchForm.getFieldsValue();
                  setSearChContent(search);
                }}
              >
                查询
              </Button>
              <Button
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
  const dataSource = [{
    cellStyleMap: {},
    id: 103,
    topicName: "话题名称话题名称话题名称",
    publishState: 0,
    invoiceTypeStr: null,
    associatedContent: 100,
    weight: 100,
    totalPriceDou: 0,
    publisher: 0,
    invoiceFormStr: null,
    publishTime: 1666317739000
  }]
  const columns = [
    {
      title: '序号',
      dataIndex: 'sort',
      width: 80,
      render: (_: any, _record: LogoutVerify.Content, index: number) =>
        pageInfo.pageSize * (pageInfo.pageIndex - 1) + index + 1,
    },
    {
      title: '话题名称',
      dataIndex: 'topicName',
      isEllipsis: true,
      width: 200,
    },
    {
      title: '发布状态',
      dataIndex: 'publishState',
      width: 100,
    },
    {
      title: '关联内容数',
      dataIndex: 'associatedContent',
      width: 120,
    },
    {
      title: '权重',
      dataIndex: 'weight',
      width: 80,
    },
    {
      title: '发布人',
      dataIndex: 'publisher',
      width: 100,
    },
    {
      title: '发布时间',
      dataIndex: 'publishTime',
      width: 190,
      render: (_: string) => moment(_).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      width: 240,
      fixed: 'right',
      dataIndex: 'option',
      render: (_: any, record: any) => {
        return (
          <div className={sc('container-option')}>
              <Button type="link" onClick={() => {
                window.open(`/purchase-manage/order-manage/detail?id=${record.orderNo}&type=2`)
              }}>
                详情
              </Button>
              <Button type="link" onClick={() => {
                window.open(`/purchase-manage/order-manage/detail?id=${record.orderNo}&type=2`)
              }}>
                编辑
              </Button>
            <Button type="link" onClick={() => {
              window.open(`/purchase-manage/order-manage/detail?id=${record.orderNo}&type=2`)
            }}>
              上架
            </Button>
            <Button type="link" onClick={() => {
              window.open(`/purchase-manage/order-manage/detail?id=${record.orderNo}&type=2`)
            }}>
              权重设置
            </Button>
              <Button type="link" onClick={() => {
                window.open(`/purchase-manage/order-manage/detail?id=${record.orderNo}&type=2`)
              }}>
                删除
              </Button>
          </div>
        )
      },
    },
  ];

  return (
    <PageContainer className={sc('container')}>
      {useSearchNode()}
      <div className={sc('container-table-header')}>
        <Button
          type="primary"
          key="addStyle"
        >
          新增话题
        </Button>
      </div>
      <div className={sc('container-table-body')}>
        <SelfTable
          bordered
          // scroll={{ x: 1480 }}
          columns={columns}
          dataSource={dataSource}
          pagination={
            pageInfo.totalCount === 0
              ? false
              : {
                total: pageInfo.totalCount,
                current: pageInfo.pageIndex,
                pageSize: pageInfo.pageSize,
                showTotal: (total: number) =>
                  `共${total}条记录 第${pageInfo.pageIndex}/${pageInfo.pageTotal || 1}页`,
              }
          }
        />
      </div>
    </PageContainer>
  );
};
