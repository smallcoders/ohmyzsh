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
import { PageContainer } from '@ant-design/pro-layout';
import './index.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useEffect, useState } from 'react';
import type Common from '@/types/common';
import moment from 'moment';
import SelfTable from '@/components/self_table';
import type LogoutVerify from '@/types/user-config-logout-verify';
import { confirmUserDelete, getLogoutPage } from '@/services/logout-verify';
import User from '@/types/user.d';
const sc = scopedClasses('user-config-logout-verify');

export default () => {
  const [dataSource, setDataSource] = useState<LogoutVerify.Content[]>([]);
  // const [types, setTypes] = useState<any[]>([]);
  const [searchContent, setSearChContent] = useState<LogoutVerify.SearchContent>({});

  const formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };

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
      render: (_: any, _record: any, index: number) =>
        pageInfo.pageSize * (pageInfo.pageIndex - 1) + index + 1,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      width: 100,
    },
    {
      title: '用户名',
      dataIndex: 'loginName',
      width: 100,
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      width: 100,
    },
    {
      title: '身份',
      dataIndex: 'identities',
      render: (text: any, record: any) => text?.map(p => p.desc).join('、'),
      width: 100,
    },
    {
      title: '注销时间',
      dataIndex: 'createTime',
      width: 200,
      render: (_: string) => _ ? _ : '--',
    },
  ];

  useEffect(() => {
    getPage();
  }, [searchContent]);

  const useSearchNode = (): React.ReactNode => {
    const [searchForm] = Form.useForm();
    return (
      <div className={sc('container-search')}>
        <Form {...formLayout} form={searchForm}>
          <Row>
            <Col span={8}>
              <Form.Item name="name" label="姓名">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="loginName" label="用户名">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="phone" label="手机号">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="userIdentity" label="身份">
                <Select placeholder="请选择" allowClear>
                  {Object.entries(User.PlatRoleJson).map((p) => (
                    <Select.Option key={p[0] + p[1]} value={p[0]}>
                      {p[1]}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="time" label="注销时间">
                <DatePicker.RangePicker allowClear showTime />
              </Form.Item>
            </Col>
            <Col offset={4} span={4}>
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

  return (
    <PageContainer className={sc('container')}>
      {useSearchNode()}
      <div className={sc('container-table-header')}>
        <div className="title">
          <span>消息列表(共{pageInfo.totalCount || 0}个)</span>
        </div>
      </div>
      <div className={sc('container-table-body')}>
        <SelfTable
          rowKey="id"
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
