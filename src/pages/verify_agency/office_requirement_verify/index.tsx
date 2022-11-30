import {
  Button,
  Input,
  Form,
  Select,
  Row,
  Col,
  DatePicker,
  message,
  Space
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
import type DiagnosticTasks from '@/types/service-config-diagnostic-tasks';
import { Access, history, useAccess } from 'umi';
import { getDictionay } from '@/services/common';
import { getAreaTree } from '@/services/area';
import { getOfficeRequirementVerifyList } from '@/services/office-requirement-verify';
const sc = scopedClasses('service-config-app-news');
const stateObj = {
  AUDITING: '待审核',
  AUDIT_PASSED: '已通过',
  AUDIT_REJECTED: '已拒绝',
};
import { renderSolutionType } from '../../service_config/solution/solution';
export default () => {
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [searchContent, setSearChContent] = useState<{
    name?: string; // 标题
    startDateTime?: string; // 提交开始时间
    auditState?: number; // 状态： 3:通过 4:拒绝
    userName?: string; // 用户名
    endDateTime?: string; // 提交结束时间
    type?: number; // 行业类型id 三级类型
  }>({});

  const access = useAccess()

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
  // 方案服务区域
  const [areaOptions, setAreaOptions] = useState<any>([]);
  // 需求类型
  const [typeOptions, setTypeOptions] = useState<any>([]);

  const [form] = Form.useForm();

  const getPage = async (pageIndex: number = 1, pageSize = pageInfo.pageSize) => {
    try {
      const { result, totalCount, pageTotal, code } = await getOfficeRequirementVerifyList({
        pageIndex,
        pageSize,
        ...searchContent,
      });
      if (code === 0) {
        // debugger
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
      // 查询需求类型选项
      getDictionay('NEW_ENTERPRISE_DICT').then((data) => {
        setTypeOptions(data?.result || []);
      });
      // 查询方案区域
      getAreaTree({}).then((data) => {
        setAreaOptions(data?.children || []);
      });
    } catch (error) {
      message.error('数据初始化错误');
    }
  };
  useEffect(() => {
    prepare();
  }, []);

  const columns = [
    {
      title: '排序',
      dataIndex: 'sort',
      width: 80,
      render: (_: any, _record: ServiceCommissionerVerify.Content, index: number) =>
        pageInfo.pageSize * (pageInfo.pageIndex - 1) + index + 1,
    },
    {
      title: '需求名称',
      dataIndex: 'name',
      render: (_: string, _record: any) => (
        <a
          onClick={() => {
            history.push(`${routeName.OFFICE_REQUIREMENT_VERIFY_DETAIL}?id=${_record.demandId}&auditId=${_record.id}&state=${_record.auditState}`);
          }}
        >
          {_}
        </a>
      ),
      width: 300,
    },
    {
      title: '需求类型',
      dataIndex: 'typeNames',
      isEllipsis: true,
      render: (text: any, record: any) => record?.typeNames?.join('、'),
      // render: (text: any, record: any) => renderSolutionType(record.type),
      width: 300,
    },
    {
      title: '需求地区',
      dataIndex: 'areaNames',
      isEllipsis: true,
      render: (text: any, record: any) => record.areaNames.join('、'),
      width: 300,
    },
    {
      title: '需求时间范围',
      dataIndex: 'startDate',
      isEllipsis: true,
      render: (_: string, _record: any) => _record.startDate + '至' + _record.endDate,
      width: 300,
    },
    {
      title: '联系人',
      dataIndex: 'contact',
      isEllipsis: true,
      width: 300,
    },
    {
      title: '联系方式',
      dataIndex: 'phone',
      isEllipsis: true,
      width: 300,
    },
    {
      title: '是否隐藏',
      dataIndex: 'hide',
      isEllipsis: true,
      render: (_: string, _record: any) => _record.hide ? '是' : '否',
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
      dataIndex: 'auditState',
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
      title: '操作',
      width: 200,
      fixed: 'right',
      dataIndex: 'option',
      render: (_: any, record: any) => {
        return record.auditState === 'AUDITING' ? (
          <Space size={20}>
            <Access accessible={access?.['P_AT_QYXQ']}>
              <a
                href="javascript:void(0)"
                onClick={() => {
                  history.push(`${routeName.OFFICE_REQUIREMENT_VERIFY_DETAIL}?id=${record.demandId}`);
                }}
              >
                审核
              </a>
            </Access>


          </Space>
        ) : (
          <div style={{ display: 'grid' }}>
            <span>
              {record.auditTime
                ? moment(record.auditTime).format('YYYY-MM-DD HH:mm:ss')
                : '--'}
            </span>
            <span>操作人：{record.auditorName}</span>
          </div>
        );
      },
    },
  ].filter(p => p);

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
              <Form.Item name="name" label="需求名称">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="type" label="需求类型">
                <Select placeholder="请选择" allowClear>
                  {typeOptions?.map((p) => (
                    <Select.Option key={p.id} value={p.id}>
                      {p.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="publisherName" label="联系人">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <Form.Item name="publishTimeSpan" label="提交时间">
                <DatePicker.RangePicker allowClear showTime />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="auditState" label="审核状态">
                <Select placeholder="请选择" allowClear>
                  <Select.Option key={'AUDITING'} value={'AUDITING'}>待审核</Select.Option>
                  <Select.Option key={'AUDIT_PASSED'} value={'AUDIT_PASSED'}>已通过</Select.Option>
                  <Select.Option key={'AUDIT_REJECTED'} value={'AUDIT_REJECTED'}>已拒绝</Select.Option>
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
                  if (search.publishTimeSpan) {
                    search.submitStartTime = moment(search.publishTimeSpan[0]).format('YYYY-MM-DD HH:mm:ss');
                    search.submitEndTime = moment(search.publishTimeSpan[1]).format('YYYY-MM-DD HH:mm:ss');
                  }
                  setSearChContent(search);
                }}
              >
                查询
              </Button>
              <Button
                type="primary"
                key="primary2"
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
          rowKey={'id'}
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
