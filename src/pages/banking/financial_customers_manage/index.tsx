import {
  Button,
  Input,
  Form,
  Row,
  Col,
  DatePicker,
  message as antdMessage,
} from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import './index.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useEffect, useState } from 'react';
import type Common from '@/types/common';
import type FinancialCustomersManage from '@/types/financial_customers_manage';
import moment from 'moment';
import { history } from 'umi';
import SelfTable from '@/components/self_table';
import { routeName } from '@/../config/routes';
import {
  getCustomers,
} from '@/services/financial_customers_manage';
const sc = scopedClasses('financial-customers-manage');

export default () => {
  const [dataSource, setDataSource] = useState<FinancialCustomersManage.Content[]>([]);
  const [searchContent, setSearChContent] = useState<FinancialCustomersManage.SearchContent>({});
  const [searchForm] = Form.useForm();
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
      const { result, totalCount, pageTotal, code, message } = await getCustomers({
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

  const columns = [
    {
      title: '序号',
      dataIndex: 'sort',
      width: 80,
      render: (_: any, _record: any, index: number) =>
        pageInfo.pageSize * (pageInfo.pageIndex - 1) + index + 1,
    },
    {
      title: '企业名称',
      dataIndex: 'name',
      isEllipsis: true,
      width: 200,
    },
    {
      title: '统一社会信用代码',
      dataIndex: 'creditCode',
    },
    {
      title: '成立时间',
      dataIndex: 'buildDate',
    },
    {
      title: '法定代表人',
      dataIndex: 'legalPersonName',
    },
    {
      title: '注册地址',
      dataIndex: 'registerAddress',
    },
    {
      title: '联系人',
      dataIndex: 'contacts',
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
    },
    {
      title: '操作',
      hideInSearch: true,
      fixed: 'right',
      render: (_: any, record: any) => (
        <>
          <Button
            size="small"
            type="link"
            onClick={() => {
              history.push(`${routeName.FINANCIAL_CUSTOMERS_MANAGE_DETAIL}?id=${record.id}`);
            }}
          >
            详情
          </Button>
          <Button
            size="small"
            type="link"
            onClick={() => {
              history.push(`${routeName.FINANCIAL_CUSTOMERS_MANAGE_EDIT}?id=${record.id}`);
            }}
          >
            编辑
          </Button>
        </>
      ),
    },
  ];

  const getSearchQuery = () => {
    const search = searchForm.getFieldsValue();
    if (search.time) {
      search.startTime = moment(search.time[0]).format('YYYY-MM-DD');
      search.endTime = moment(search.time[1]).format('YYYY-MM-DD');
    }
    delete search.time;
    return search;
  };
  useEffect(() => {
    getPage();
  }, [searchContent]);

  const useSearchNode = (): React.ReactNode => {
    return (
      <div className={sc('container-search')}>
        <Form {...formLayout} form={searchForm}>
          <Row>
            <Col span={8}>
              <Form.Item name="name" label="企业名称">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="time" label="成立时间">
                <DatePicker.RangePicker allowClear />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="contacts" label="联系人">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="phone" label="联系电话">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col offset={12} span={4}>
              <Button
                style={{ marginRight: 20 }}
                type="primary"
                key="search"
                onClick={() => {
                  const search = getSearchQuery();
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
