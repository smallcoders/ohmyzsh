import {
  Button,
  Input,
  Form,
  Select,
  Row,
  Col,
  DatePicker,
  message,
  Space,
  Popconfirm,
} from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import './index.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useEffect, useState } from 'react';
import Common from '@/types/common';
import ServiceCommissionerVerify from '@/types/service-config-ServiceCommissionerVerify.d';
import moment from 'moment';
import { routeName } from '@/../config/routes';
import SelfTable from '@/components/self_table';
import { history } from 'umi';
import { handleAuditCommissioner } from '@/services/audit';
import SelfSelect from '@/components/self_select';
import { getDictionay } from '@/services/common';
import { getCommissionerVerifyPage } from '@/services/service-commissioner-verify';
const sc = scopedClasses('service-config-app-news');
const stateObj = {
  AUDITING: '待审核',
  AUDIT_PASSED: '已通过',
  AUDIT_REJECTED: '已拒绝',
};
export default () => {
  const [dataSource, setDataSource] = useState<ServiceCommissionerVerify.Content[]>([]);
  const [refuseContent, setRefuseContent] = useState<string>('');
  const [searchContent, setSearChContent] = useState<{
    name?: string; // 标题
    startDateTime?: string; // 提交开始时间
    auditState?: number; // 状态： 3:通过 4:拒绝
    userName?: string; // 用户名
    endDateTime?: string; // 提交结束时间
    typeId?: number; // 行业类型id 三级类型
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

  const [serviceTypes, setServiceType] = useState<any>([]);

  const [selectTypes, setSelectTypes] = useState<any>([]);
  // const [form] = Form.useForm();

  const getPage = async (pageIndex: number = 1, pageSize = pageInfo.pageSize) => {
    try {
      const { result, totalCount, pageTotal, code } = await getCommissionerVerifyPage({
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

  const prepare = async () => {
    try {
      getDictionay('COMMISSIONER_SERVICE_TYPE').then((data) => {
        setServiceType(data.result || []);
      });
    } catch (error) {
      message.error('数据初始化错误');
    }
  };
  useEffect(() => {
    prepare();
  }, []);

  const editState = async (record: any, { ...rest }) => {
    try {
      const tooltipMessage = rest.result ? '审核通过' : '审核拒绝';
      const updateStateResult = await handleAuditCommissioner({
        auditId: record.auditId,
        ...rest,
      });
      if (updateStateResult.code === 0) {
        message.success(`${tooltipMessage}成功`);
        getPage();
        if (!rest.result) setRefuseContent('');
      } else {
        message.error(`${tooltipMessage}失败，原因:{${updateStateResult.message}}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    {
      title: '排序',
      dataIndex: 'sort',
      width: 80,
      render: (_: any, _record: ServiceCommissionerVerify.Content, index: number) =>
        _record.state === 2 ? '' : pageInfo.pageSize * (pageInfo.pageIndex - 1) + index + 1,
    },
    {
      title: '专家姓名',
      dataIndex: 'expertName',
      render: (_: string, _record: any) => (
        <a
          onClick={() => {
            window.open(
              `${routeName.EXPERT_MANAGE_DETAIL}?id=${_record.expertShowId}&auditId=${_record.auditId}`,
            );
          }}
        >
          {_}
        </a>
      ),
      width: 300,
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      isEllipsis: true,
      width: 300,
    },
    {
      title: '服务类型',
      dataIndex: 'serviceTypeNames',
      isEllipsis: true,
      render: (_: string[]) => _?.join('，'),
      width: 300,
    },
    {
      title: '提交时间',
      dataIndex: 'submitTime',
      width: 200,
      render: (_: string) => moment(_).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '审核状态',
      dataIndex: 'state',
      width: 200,
      render: (_: string) => {
        return (
          <div className={`state${_}`}>
            {Object.prototype.hasOwnProperty.call(stateObj, _) ? stateObj[_] : '--'}
          </div>
        );
      },
    },
    {
      title: '审核',
      width: 200,
      fixed: 'right',
      dataIndex: 'option',
      render: (_: any, record: any) => {
        return record.state === 'AUDITING' ? (
          <Space size={20}>
            <Popconfirm
              icon={<span style={{ fontSize: 18 }}>请确认专员服务类型是否选择正确</span>}
              title={
                <div style={{ width: 500 }}>
                  <SelfSelect
                    dictionary={serviceTypes}
                    fieldNames={{
                      label: 'name',
                      value: 'id',
                    }}
                    value={selectTypes}
                    onChange={(values) => {
                      setSelectTypes(values);
                    }}
                  />
                </div>
              }
              okButtonProps={{
                disabled: selectTypes?.length === 0,
              }}
              okText="确定"
              cancelText="取消"
              onConfirm={() => editState(record, { result: true, ids: selectTypes })}
              onCancel={() => {
                setSelectTypes([]);
              }}
            >
              <Button
                type="link"
                onClick={() => {
                  setSelectTypes(
                    record.serviceTypeIds?.split(',')?.map((p: string) => Number(p)) || [],
                  );
                }}
              >
                通过
              </Button>
            </Popconfirm>
            <Popconfirm
              icon={null}
              title={
                <>
                  请输入拒绝原因（非必填）
                  <Input.TextArea
                    onChange={(e) => setRefuseContent(e.target.value)}
                    value={refuseContent}
                    showCount
                    maxLength={200}
                  />
                </>
              }
              okText="确定"
              cancelText="取消"
              onConfirm={() => editState(record, { result: false, reason: refuseContent })}
            >
              <Button type="link">拒绝</Button>
            </Popconfirm>
          </Space>
        ) : (
          <div style={{ display: 'grid' }}>
            <span>
              {record.auditDateTime
                ? moment(record.auditDateTime).format('YYYY-MM-DD HH:mm:ss')
                : '--'}
            </span>
            <span>操作人：{record.operatorName}</span>
          </div>
        );
      },
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
              <Form.Item name="expertName" label="专家姓名">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="phone" label="手机号">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="serviceTypeId" label="服务类型">
                <Select placeholder="请选择" allowClear>
                  {serviceTypes?.map((p) => (
                    <Select.Option key={p.id} value={p.id}>
                      {p.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <Form.Item name="time" label="提交时间">
                <DatePicker.RangePicker allowClear showTime />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="state" label="审核状态">
                <Select placeholder="请选择" allowClear>
                  <Select.Option value={'AUDITING'}>待审核</Select.Option>
                  <Select.Option value={'AUDIT_PASSED'}>已通过</Select.Option>
                  <Select.Option value={'AUDIT_REJECTED'}>已拒绝</Select.Option>
                </Select>
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
                    search.startSubmitTime = moment(search.time[0]).format('YYYY-MM-DD HH:mm:ss');
                    search.endSubmitTime = moment(search.time[1]).format('YYYY-MM-DD HH:mm:ss');
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
          bordered
          scroll={{ x: 1400 }}
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
