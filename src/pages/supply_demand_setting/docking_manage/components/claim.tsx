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
  Popconfirm,
  Tooltip,
} from 'antd';
import './index.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useEffect, useState } from 'react';
import type Common from '@/types/common';
import moment from 'moment';
import SelfTable from '@/components/self_table';
import { Access, useAccess } from 'umi';
import { routeName } from '@/../config/routes';
import type ConsultRecord from '@/types/expert_manage/consult-record';
import { cancelClaimDemand, claimDemand, getClaimUsers, getDemandPage } from '@/services/creative-demand';
import DockingManage from '@/types/docking-manage.d';
import { PageInfo } from '@ant-design/pro-table/lib/typing';
const { RangePicker } = DatePicker

const sc = scopedClasses('user-config-logout-verify');
const enum Edge {
  HOME = 0, // 新闻咨询首页
}

export default () => {
  const [dataSource, setDataSource] = useState<DockingManage.Content[]>([]);
  const [searchContent, setSearChContent] = useState<DockingManage.searchContent>({});
  // 拿到当前角色的access权限兑现
  const access = useAccess();
  // 当前页面的对应权限key
  const [edge, setEdge] = useState<Edge.HOME>(Edge.HOME);
  // 页面权限
  const permissions = {
    [Edge.HOME]: 'PQ_SD_XQRL', // 供需对接管理-需求认领
  };

  useEffect(() => {
    for (const key in permissions) {
      const permission = permissions[key];
      if (Object.prototype.hasOwnProperty.call(access, permission)) {
        setEdge(key as any);
        break;
      }
    }
  }, []);

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

  const getPage = async (pageIndex = pageInfo.pageIndex, pageSize = pageInfo.pageSize) => {
    try {
      const { result, totalCount, pageTotal, code, message } = await getDemandPage({
        pageIndex,
        pageSize,
        ...searchContent,
        tabType: 0
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

  const methodObj = {
    claim: async (record: any) => {
      const tooltipMessage = '认领';
      try {
        const markResult = await claimDemand(record.id);
        if (markResult.code === 0) {
          antdMessage.success(`${tooltipMessage}成功`);
          getPage();
        } else {
          throw new Error(markResult.message);
        }
      } catch (error) {
        antdMessage.error(`${tooltipMessage}失败，原因:{${error}}`);
      }
    },

    cancelClaim: async (record: any) => {
      const tooltipMessage = '取消认领';
      try {
        const markResult = await cancelClaimDemand(record.id);
        if (markResult.code === 0) {
          antdMessage.success(`${tooltipMessage}成功`);
          getPage();
        } else {
          throw new Error(markResult.message);
        }
      } catch (error) {
        antdMessage.error(`${tooltipMessage}失败，原因:{${error}}`);
      }
    }

  }

  const columns = [
    {
      title: '序号',
      dataIndex: 'sort',
      width: 80,
      render: (_: any, _record: ConsultRecord.Content, index: number) =>
        pageInfo.pageSize * (pageInfo.pageIndex - 1) + index + 1,
    },
    {
      title: '需求名称',
      dataIndex: 'name',
      width: 150,
      render: (_: string, _record: any) => (
        <a
          onClick={() => {
            window.open(`${routeName.DEMAND_MANAGEMENT_DETAIL}?id=${_record.id}`);
          }}
        >
          {_}
        </a>
      ),
      isEllipsis: true,
    },
    {
      title: '所属企业',
      dataIndex: 'orgName',
      isEllipsis: true,
      width: 200,
    },
    {
      title: '需求状态',
      dataIndex: 'claimState',
      isEllipsis: true,
      render: (_: string) => DockingManage.demandType[_],
      width: 150,
    },

    {
      title: '需求发布时间',
      dataIndex: 'publishTime',
      isEllipsis: true,
      render: (_: string) => moment(_).format('YYYY-MM-DD HH:mm:ss'),
      width: 250,
    },
    {
      title: '需求认领人',
      dataIndex: 'claimName',
      render: (_: string) => _ || '--',
      width: 100,

    },
    {
      title: '操作',
      width: 200,
      fixed: 'right',
      dataIndex: 'option',
      render: (_: any, record: any) => {
        const accessible = access?.[permissions?.[edge].replace(new RegExp("Q"), "")]
        return <div style={{ textAlign: 'center' }}>
          <Access accessible={accessible}>
            <Space size={20}>
              {record?.btnList?.map(p => <Button
                type="link"
                onClick={() => {
                  // setRemark(record.remark || '');
                  DockingManage.btnList[p]?.method && methodObj?.[DockingManage.btnList[p]?.method](record)
                }}
              >
                {DockingManage.btnList[p]?.text}
              </Button>)}
            </Space>
          </Access>
        </div>
      },
    },
  ];

  useEffect(() => {
    getPage();
  }, [searchContent]);

  useEffect(() => {
    prepare()
  }, [])
  const [users, setUsers] = useState<any>([])
  const prepare = async () => {
    try {
      const userRes = await getClaimUsers()
      setUsers(userRes?.result || [])
    } catch (error) {

    }
  }

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
              <Form.Item name="orgName" label="所属企业">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="claimState" label="需求状态">
                <Select placeholder="请选择" allowClear>
                  <Select.Option value={3}>新发布</Select.Option>
                  <Select.Option value={1}>已认领</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <Form.Item name="time" label="需求发布时间">
                <RangePicker allowClear showTime />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="claimId" label="需求认领人">
                <Select placeholder="请选择" allowClear>
                  <Select.Option value={-1}>
                    待认领
                  </Select.Option>
                  {users?.map((p: { claimUserId: React.Key | null | undefined; claimName: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }) => (
                    <Select.Option key={p.claimUserId} value={p.claimUserId}>
                      {p.claimName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col offset={4} span={4}>
              <Button
                style={{ marginRight: 20 }}
                type="primary"
                key="search"
                onClick={() => {
                  setPageInfo({
                    pageIndex: 1,
                    pageSize: 10,
                    totalCount: 0,
                    pageTotal: 0
                  });
                  const search = searchForm.getFieldsValue();
                  if (search.time) {
                    search.publishStartTime = moment(search.time[0]).format('YYYY-MM-DD HH:mm:ss');
                    search.publishEndTime = moment(search.time[1]).format('YYYY-MM-DD HH:mm:ss');
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
    <>
      {useSearchNode()}
      <div className={sc('container-table-body')}>
        <SelfTable
          bordered
          scroll={{ x: 1280 }}
          columns={columns}
          rowKey={'id'}
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
    </>
  );
};
