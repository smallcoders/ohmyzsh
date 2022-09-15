import {
  Button,
  Input,
  Form,
  Select,
  Row,
  Col,
  DatePicker,
  message as antdMessage,
  Modal,
} from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import './index.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useEffect, useState, useCallback } from 'react';

import { useHistory } from 'react-router-dom';
import type Common from '@/types/common';
import moment from 'moment';
import SelfTable from '@/components/self_table';
import type LogoutVerify from '@/types/user-config-logout-verify';
import { confirmUserDelete, getLogoutPage } from '@/services/logout-verify';
import { routeName } from '@/../config/routes';
import { getBankingServicePage } from '@/services/banking-service';
const sc = scopedClasses('user-config-logout-verify');
const updateOptions = [
  {
    label: '需求已确认',
    value: 1,
  },
  {
    label: '匹配金融机构产品服务中',
    value: 2,
  },
  {
    label: '已提供金融解决方案',
    value: 3,
  },
  {
    label: '已提供金融解决方案',
    value: 4,
  },
];
export default () => {
  const [dataSource, setDataSource] = useState<LogoutVerify.Content[]>([]);
  // const [types, setTypes] = useState<any[]>([]);
  const [searchContent, setSearChContent] = useState<LogoutVerify.SearchContent>({});
  const history = useHistory();
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
  /**
   * 新建窗口的弹窗
   *  */
  const [updateModalVisible, setModalVisible] = useState<boolean>(false);

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
  const goEdit = useCallback(
    (record: { id: number }) => {
      history.push(`/purchase-manage/commodity-create?id=${record.id}`);
    },
    [history],
  );

  const goDetail = useCallback(
    (record: { id: number }) => {
      history.push(`/service-config/banking_service_manage/detail?id=${record.id}`);
    },
    [history],
  );
  const columns = [
    {
      title: '序号',
      dataIndex: 'sort',
      width: 80,
      render: (_: any, _record: LogoutVerify.Content, index: number) =>
        pageInfo.pageSize * (pageInfo.pageIndex - 1) + index + 1,
    },
    {
      title: '申请人姓名',
      dataIndex: 'auditType',
      width: 200,
    },
    {
      title: '申请金额（万元）',
      dataIndex: 'userName',
      isEllipsis: true,
      width: 200,
    },
    {
      title: '拟融资期限',
      dataIndex: 'certificateName',
      isEllipsis: true,
      render: (_: string) => _ || '/',
      width: 200,
    },
    {
      title: '申请金融产品',
      dataIndex: 'phone',
      isEllipsis: true,
      width: 200,
    },
    {
      title: '联系电话',
      dataIndex: 'accountType',
      isEllipsis: true,
      width: 200,
    },
    {
      title: '组织名称',
      dataIndex: 'accountType',
      isEllipsis: true,
      width: 200,
    },
    {
      title: '状态',
      dataIndex: 'accountType',
      isEllipsis: true,
      width: 200,
    },

    {
      title: '申请时间',
      dataIndex: 'submitTime',
      width: 200,
      render: (_: string) => moment(_).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      hideInSearch: true,
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <>
          <Button
            size="small"
            type="link"
            onClick={() => history.push(`${routeName.BANKING_SERVICE_DETAIL}?id=${record.id}`)}
          >
            详情
          </Button>

          <Button size="small" type="link" onClick={() => setModalVisible(true)}>
            更新处理状态
          </Button>
        </>
      ),
    },
  ];
  const updateStatus = () => {};
  const getUpdateModal = () => {
    return (
      <Modal
        title={'更新处理状态'}
        width="400px"
        visible={updateModalVisible}
        maskClosable={false}
        onCancel={() => {
          setModalVisible(false);
        }}
        onOk={async () => {
          await updateStatus();
        }}
      >
        <Select placeholder="请选择" style={{ width: '100%' }}>
          {updateOptions.map((item) => (
            <Select.Option key={item.value} value={item.value}>
              {item.label}
            </Select.Option>
          ))}
        </Select>
      </Modal>
    );
  };
  useEffect(() => {
    getPage();
    getBankingServicePage({
      pageSize: 10,
      pageIndex: 1,
    });
  }, [searchContent]);

  const useSearchNode = (): React.ReactNode => {
    const [searchForm] = Form.useForm();
    return (
      <div className={sc('container-search')}>
        <Form {...formLayout} form={searchForm}>
          <Row>
            <Col span={8}>
              <Form.Item name="userName" label="组织名称">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="certificateName" label="产品名称">
                <Select placeholder="请选择" allowClear>
                  <Select.Option value={'ENTERPRISE'}>工业企业</Select.Option>
                  <Select.Option value={'SERVICE_PROVIDER'}>服务商</Select.Option>
                  <Select.Option value={'EXPERT'}>专家</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="time" label="提交时间">
                <DatePicker.RangePicker allowClear showTime />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <Form.Item name="accountType" label="状态">
                <Select placeholder="请选择" allowClear>
                  <Select.Option value={'ENTERPRISE'}>1</Select.Option>
                  <Select.Option value={'SERVICE_PROVIDER'}>2</Select.Option>
                  <Select.Option value={'EXPERT'}>3</Select.Option>
                </Select>
              </Form.Item>
            </Col>

            <Col offset={12} span={4}>
              <Button
                style={{ marginRight: 20 }}
                type="primary"
                key="search"
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
          <Button type="primary" href={`/antelope-pay/mng/order/detail/export?orderNo=1`}>
            导出
          </Button>
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
      {getUpdateModal()}
    </PageContainer>
  );
};
