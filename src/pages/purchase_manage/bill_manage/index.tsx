import {
  Button,
  Input,
  Form,
  Select,
  Row,
  Col,
  DatePicker,
  message as antdMessage,
  Space,
} from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import './index.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useEffect, useState } from 'react';
import type Common from '@/types/common';
import moment from 'moment';
import SelfTable from '@/components/self_table';
import type LogoutVerify from '@/types/user-config-logout-verify';
import { confirmUserDelete, getLogoutPage } from '@/services/logout-verify';
const sc = scopedClasses('user-config-logout-verify');

export default () => {
  const [dataSource, setDataSource] = useState<LogoutVerify.Content[]>([]);
  const [searchContent, setSearChContent] = useState<LogoutVerify.SearchContent>({});

  const formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };
  const [searchForm] = Form.useForm();

  const [pageInfo, setPageInfo] = useState<Common.ResultPage>({
    pageIndex: 1,
    pageSize: 10,
    totalCount: 0,
    pageTotal: 0,
  });

  const getPage = async (pageIndex: number = 1, pageSize = pageInfo.pageSize) => {
    try {
      const { result, totalCount, pageTotal, code, message } = await getLogoutPage({
        pageIndex,
        pageSize,
        ...searchContent,
      });
      if (code === 0) {
        setPageInfo({ totalCount, pageTotal, pageIndex, pageSize });
        setDataSource(result);
      } else {
        throw new Error(message);
      }
    } catch (error) {
      antdMessage.error(`请求失败，原因:{${error}}`);
    }
  };

  const pass = async (record: any) => {
    const tooltipMessage = '审核通过';
    try {
      const updateStateResult = await confirmUserDelete(record.id);
      if (updateStateResult.code === 0) {
        antdMessage.success(`${tooltipMessage}成功`);
        getPage();
      } else {
        throw new Error(updateStateResult.message);
      }
    } catch (error) {
      antdMessage.error(`${tooltipMessage}失败，原因:{${error}}`);
    }
  };

  const columns = [
    {
      title: '序号',
      dataIndex: 'sort',
      width: 80,
      render: (_: any, _record: LogoutVerify.Content, index: number) =>
        pageInfo.pageSize * (pageInfo.pageIndex - 1) + index + 1,
    },
    {
      title: '订单编号',
      dataIndex: 'auditType',
      width: 200,
    },
    {
      title: '活动名称',
      dataIndex: 'userName',
      isEllipsis: true,
      width: 200,
    },
    {
      title: '活动编码',
      dataIndex: 'certificateName',
      isEllipsis: true,
      render: (_: string) => _ || '/',
      width: 200,
    },
    {
      title: '发票类型',
      dataIndex: 'phone',
      isEllipsis: true,
      width: 200,
    },
    {
      title: '发票抬头',
      dataIndex: 'accountType',
      isEllipsis: true,
      width: 200,
    },
    {
      title: '发票金额',
      dataIndex: 'phone',
      isEllipsis: true,
      width: 200,
    },
    {
      title: '开票形式',
      dataIndex: 'accountType',
      isEllipsis: true,
      width: 200,
    },
    {
      title: '创建时间',
      dataIndex: 'submitTime',
      width: 200,
      render: (_: string) => moment(_).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      width: 200,
      fixed: 'right',
      dataIndex: 'option',
      render: (_: any, record: any) => {
        return (
          <div style={{ textAlign: 'center' }}>
            <Space size={20}>
              {/* 跳转到订单管理-订单详情，且选中「发票信息」页签 */}
              <Button type="link" onClick={() => pass(record)}>
                查看详情
              </Button>
            </Space>
          </div>
        )
      },
    },
  ];

  useEffect(() => {
    getPage();
  }, [searchContent]);

  const useSearchNode = (): React.ReactNode => {
    return (
      <div className={sc('container-search')}>
        <Form {...formLayout} form={searchForm}>
          <Row>
            <Col span={8}>
              <Form.Item name="userName" label="订单编号">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="certificateName" label="活动名称">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="accountType" label="发票类型">
                <Select placeholder="请选择" allowClear>
                  <Select.Option value={'ENTERPRISE'}>增值税专用发票</Select.Option>
                  <Select.Option value={'SERVICE_PROVIDER'}>增值税普通发票</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <Form.Item name="accountType" label="开票形式">
                <Select placeholder="请选择" allowClear>
                  <Select.Option value={'ENTERPRISE'}>电子发票</Select.Option>
                  <Select.Option value={'SERVICE_PROVIDER'}>纸质发票</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="time" label="创建时间">
                <DatePicker.RangePicker allowClear showTime />
              </Form.Item>
            </Col>
            <Col offset={4} span={4}>
              <Button
                style={{ marginRight: 20 }}
                type="primary"
                key="primary"
                onClick={() => {
                  const search = searchForm.getFieldsValue();
                  if (search.time) {
                    search.submitStartTime = moment(search.time[0]).format('YYYY-MM-DDTHH:mm:ss');
                    search.submitEndTime = moment(search.time[1]).format('YYYY-MM-DDTHH:mm:ss');
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
          <span>发票列表(共{pageInfo.totalCount || 0}个)</span>
          <Button type='primary' icon={<DownloadOutlined />}>导出</Button>
        </div>
      </div>
      <div className={sc('container-table-body')}>
        <SelfTable
          bordered
          scroll={{ x: 1480 }}
          columns={columns}
          dataSource={dataSource}
          pagination={
            pageInfo.totalCount === 0
              ? false
              : {
                  onChange: getPage,
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
