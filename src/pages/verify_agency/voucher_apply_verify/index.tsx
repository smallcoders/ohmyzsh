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
import { history, Access, useAccess } from 'umi';
import { getAreaTree } from '@/services/area';
import { getVoucherVerifyPage } from '@/services/service-programme-verify';
const sc = scopedClasses('service-config-app-news');
const stateObj = {
  0: '待审核',
  1: '已通过',
  2: '已拒绝',
};
enum Edge {
  HOME = 0, // 新闻咨询首页
}
export default () => {
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [searchContent, setSearChContent] = useState<{
    orgName?: string; // 企业名称
    applyTimeStart?: string; // 开始时间
    auditState?: number; // 状态： 0:待审核 1:已通过 2:已拒绝
    endDateTime?: string; // 结束时间
    areaCode?: number; // 地市code
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
  // 所属地市
  const [areaOptions, setAreaOptions] = useState<any>([]);

  const getPage = async (pageIndex: number = 1, pageSize = pageInfo.pageSize) => {
    try {
      const { result, totalCount, pageTotal, code } = await getVoucherVerifyPage({
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
      // 查询所属地市
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
      title: '序号',
      dataIndex: 'sort',
      width: 80,
      render: (_: any, _record: ServiceCommissionerVerify.Content, index: number) =>
        pageInfo.pageSize * (pageInfo.pageIndex - 1) + index + 1,
    },
    {
      title: '企业名称',
      dataIndex: 'orgName',
      render: (_: string, _record: any) => (
          <span>{_record.apply.orgName}</span>
      ),
      width: 200,
    },
    {
      title: '统一社会信用代码',
      dataIndex: 'id',
      isEllipsis: true,
      render: (_: any, _record: any) => <span>{_record.apply.creditCode}</span>,
      width: 180,
    },
    {
      title: '所属地市',
      dataIndex: 'areas',
      render: (_: string, _record: any) => _record.apply.cityName ? (_record.apply.cityName + '/' + _record.apply.countyName) : '--',
      isEllipsis: true,
      width: 180,
    },
    {
      title: '申请时间',
      dataIndex: 'publishTime',
      width: 180,
      render: (_: string, _record: any) => {
        return  _record.apply.applyTime ? moment(_record.apply.applyTime).format('YYYY-MM-DD HH:mm:ss') : '--'
      },
    },
    {
      title: '行业证明材料',
      dataIndex: 'industryFiles',
      isEllipsis: true,
      width: 200,
      render: (_: string, _record: any) => {
        return  _record.industryFiles ? _record.industryFiles.map((p: any) => p?.fileName).join(',') : '--'
      },
    },
    {
      title: '企业营收证明&企业人数证明',
      dataIndex: 'incomeFiles',
      isEllipsis: true,
      width: 300,
      render: (_: string, _record: any) => {
        return  _record.incomeFiles ? _record.incomeFiles.map((p: any) => p?.fileName).join(',') : '--'
      },
    },
    {
      title: '审核状态',
      dataIndex: 'pfAuditState',
      width: 160,
      render: (_: string, _record: any) => {
        return (
          <div className={`state${_record.apply.pfAuditState}`}>
            {Object.prototype.hasOwnProperty.call(stateObj, _record.apply.pfAuditState) ? stateObj[_record.apply.pfAuditState] : '--'}
          </div>
        );
      },
    },
    {
      title: '操作',
      width: 160,
      fixed: 'right',
      dataIndex: 'option',
      render: (_: any, record: any) => {
        const accessible = access?.[permissions?.[edge].replace(new RegExp("Q"), "")]
        return record.apply.pfAuditState === 0 ? (
          <Access accessible={accessible}>
            <Space size={20}>
              <a
                href="javascript:void(0)"
                onClick={() => {
                  history.push(`${routeName.VOUCHER_APPLY_VERIFY_DETAIL}?id=${record.apply.id}&state=${record.apply.pfAuditState}`);
                }}
              >
                审核
              </a>
            </Space>
          </Access>
        ) : (
          <a
            href="javascript:void(0)"
            onClick={() => {
              history.push(`${routeName.VOUCHER_APPLY_VERIFY_DETAIL}?id=${record.apply.id}&state=${record.apply.pfAuditState}`);
            }}
          >
            详情
          </a>
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
              <Form.Item name="orgName" label="企业名称">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="areaCode" label="所属地市">
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
              <Form.Item name="publishTimeSpan" label="申请时间">
                <DatePicker.RangePicker allowClear />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <Form.Item name="auditState" label="审核状态">
                <Select placeholder="请选择" allowClear>
                  <Select.Option key={'UN_CHECK'} value={0}>待审核</Select.Option>
                  <Select.Option key={'PASSED'} value={1}>已通过</Select.Option>
                  <Select.Option key={'REJECTED'} value={2}>已拒绝</Select.Option>
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
                  if (search.publishTimeSpan) {
                    search.applyTimeStart = moment(search.publishTimeSpan[0]).format('YYYY-MM-DD');
                    search.applyTimeEnd = moment(search.publishTimeSpan[1]).format('YYYY-MM-DD');
                  }
                  delete search.publishTimeSpan
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
          <span>审核列表(共{pageInfo.totalCount || 0}条)</span>
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
