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
import { history, Access, useAccess } from 'umi';
import { getEnumByName, getDictionay } from '@/services/common';
import { getAreaTree } from '@/services/area';
import { getProgrammeVerifyPage } from '@/services/service-programme-verify';
const sc = scopedClasses('service-config-app-news');
const stateObj = {
  UN_CHECK: '待审核',
  PASSED: '已通过',
  REJECTED: '已拒绝',
};
enum Edge {
  HOME = 0, // 新闻咨询首页
}
import { renderSolutionType } from '../../service_config/solution/solution';
import { values } from 'lodash';
export default () => {
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [searchContent, setSearChContent] = useState<{
    name?: string; // 标题
    startDateTime?: string; // 提交开始时间
    auditState?: number; // 状态： 3:通过 4:拒绝
    userName?: string; // 用户名
    endDateTime?: string; // 提交结束时间
    typeId?: number; // 行业类型id 三级类型
  }>({});
  // 拿到当前角色的access权限兑现
  const access = useAccess()
  // 当前页面的对应权限key
  const [edge, setEdge] = useState<Edge.HOME>(Edge.HOME);
  // 页面权限
  const permissions = {
    [Edge.HOME]: 'PQ_AT_FWFA', // 服务方案-页面查询
  }

  useEffect(() => {
    for (const key in permissions) {
      const permission = permissions[key]
      if (Object.prototype.hasOwnProperty.call(access, permission)) {
        setEdge(key as any)
        break
      }
    }
  },[])

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
  // 方案服务区域
  const [areaOptions, setAreaOptions] = useState<any>([]);
  // 方案类型
  const [typeOptions, setTypeOptions] = useState<any>([]);
  // 方案服务行业
  const [industryOptions, setIndustryOptions] = useState<any>([]);

  const [form] = Form.useForm();

  const getPage = async (pageIndex: number = 1, pageSize = pageInfo.pageSize) => {
    try {
      const { result, totalCount, pageTotal, code } = await getProgrammeVerifyPage({
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
      // 查询方案类型选项
      getDictionay('NEW_ENTERPRISE_DICT').then((data) => {
        setTypeOptions(data?.result || []);
      });
      // 查询服务行业选项
      getEnumByName('ORG_INDUSTRY').then((data) => {
        setIndustryOptions(data?.result|| []);
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
      title: '方案名称',
      dataIndex: 'name',
      render: (_: string, _record: any) => (
        <a
          onClick={() => {
            history.push(`${routeName.SERVICE_PROGRAMME_VERIFY_DETAIL}?id=${_record.id}&auditId=${_record.auditId}`);
          }}
        >
          {_}
        </a>
      ),
      width: 300,
    },
    {
      title: '方案类型',
      dataIndex: 'types',
      isEllipsis: true,
      render: (text: any, record: any) => renderSolutionType(record.types),
      width: 300,
    },
    {
      title: '方案服务行业',
      dataIndex: 'industryName',
      isEllipsis: true,
      width: 300,
    },
    {
      title: '方案服务区域',
      dataIndex: 'areas',
      render: (_: string, _record: any) => _record.areas?.map((e:any) => e.name).join('、'),
      isEllipsis: true,
      width: 300,
    },
    {
      title: '联系人',
      dataIndex: 'contactName',
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
      title: '提交时间',
      dataIndex: 'publishTime',
      width: 200,
      render: (_: string) => moment(_).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '审核状态',
      dataIndex: 'checkEnum',
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
        const accessible = access?.[permissions?.[edge].replace(new RegExp("Q"), "")]
        return record.checkEnum === 'UN_CHECK' ? (
          <Access accessible={accessible}>
            <Space size={20}>
              <a
                href="javascript:void(0)"
                onClick={() => {
                  history.push(`${routeName.SERVICE_PROGRAMME_VERIFY_DETAIL}?id=${record.id}`);
                }}
              >
                审核
              </a>
            </Space>
          </Access>
        ) : (
          <div style={{ display: 'grid' }}>
            <span>
              {record.auditTime
                ? moment(record.auditTime).format('YYYY-MM-DD HH:mm:ss')
                : '--'}
            </span>
            <span>操作人：{record.auditUserName}</span>
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
              <Form.Item name="name" label="方案名称">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="typeId" label="方案类型">
                <Select placeholder="请选择" allowClear>
                  {typeOptions?.map((p: any) => (
                    <Select.Option key={p.id} value={p.id}>
                      {p.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="industry" label="方案服务行业">
                <Select placeholder="请选择" allowClear>
                  {industryOptions?.map((p: any) => (
                    <Select.Option key={p.id} value={p.enumName}>
                      {p.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <Form.Item name="areaCode" label="方案服务区域">
                <Select placeholder="请选择" allowClear>
                  {areaOptions?.map((p: any) => (
                    <Select.Option key={p.code} value={p.code}>
                      {p.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="publishTimeSpan" label="提交时间">
                <DatePicker.RangePicker allowClear showTime />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="checkEnum" label="审核状态">
                <Select placeholder="请选择" allowClear>
                  <Select.Option key={'UN_CHECK'} value={'UN_CHECK'}>待审核</Select.Option>
                  <Select.Option key={'PASSED'} value={'PASSED'}>已通过</Select.Option>
                  <Select.Option key={'REJECTED'} value={'REJECTED'}>已拒绝</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col offset={20} span={4}>
              <Button
                style={{ marginRight: 20 }}
                type="primary"
                key="search"
                onClick={() => {
                  const search = searchForm.getFieldsValue();
                  if (search.publishTimeSpan) {
                    search.startPublishTime = moment(search.publishTimeSpan[0]).format('YYYY-MM-DD HH:mm:ss');
                    search.endPublishTime = moment(search.publishTimeSpan[1]).format('YYYY-MM-DD HH:mm:ss');
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
