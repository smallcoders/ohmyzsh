import {
  Button,
  Input,
  Form,
  Select,
  Row,
  Col,
  message as antdMessage
} from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import './index.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useEffect, useState } from 'react';
import type Common from '@/types/common';
import SelfTable from '@/components/self_table';
import type LogoutVerify from '@/types/user-config-logout-verify';
import { getLogoutPage } from '@/services/consume-statistic';
import { getAreaTree } from '@/services/area';
import User from '@/types/user.d';
import { Access, useAccess } from 'umi';
const sc = scopedClasses('user-config-logout-verify');
enum Edge {
  HOME = 0,
}
// 名单来源枚举
const listSourceObj = {
  0: '省级',
  1: '地市',
  2: '自主申领'
}

export default () => {
  const [dataSource, setDataSource] = useState<LogoutVerify.Content[]>([]);
  // const [types, setTypes] = useState<any[]>([]);
  const [searchContent, setSearChContent] = useState<LogoutVerify.SearchContent>({});
  // 拿到当前角色的access权限兑现
  const access = useAccess()
  // 当前页面的对应权限key
  const [edge, setEdge] = useState<Edge.HOME>(Edge.HOME);
  const [areaOptions, setAreaOptions] = useState<any>([]);
  // 页面权限
  const permissions = {
    [Edge.HOME]: 'PQ_UM_ZXJL', // 用户管理-用户信息
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
    labelCol: { span: 9 },
    wrapperCol: { span: 14 },
  };

  const [pageInfo, setPageInfo] = useState<Common.ResultPage>({
    pageIndex: 1,
    pageSize: 10,
    totalCount: 0,
    pageTotal: 0,
  });

  const prepare = async () => {
    try {
      getAreaTree({}).then((data) => {
        setAreaOptions(data?.children || []);
      });
    } catch(error) {
      antdMessage.error('数据初始化错误');
    }
  }

  useEffect(() => {
    prepare();
  }, []);

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

  const columns = [
    {
      title: '企业名称',
      dataIndex: 'orgName',
      width: 120,
    },
    {
      title: '统一社会信用代码',
      dataIndex: 'creditCode',
      width: 100,
    },
    {
      title: '行业代码',
      dataIndex: 'industryCode',
      width: 100,
      render: (_: string) => _ && _ != 'null' ? _ : '--',
    },
    {
      title: '名单来源',
      dataIndex: 'source',
      width: 100,
    },
    {
      title: '所属地市',
      dataIndex: 'city',
      width: 200,
      render: (_: string) => _ ? _ : '--',
    },
    {
      title: '是否注册平台',
      dataIndex: 'registerStatus',
      width: 120,
      render: (_: number) => _ === 1 ? '是' : '否',
    },
    {
      title: '领取状态',
      dataIndex: 'receiveState',
      width: 100,
      render: (_: number) => _ === 1 ? '已领取' : '未领取',
    },
    {
      title: '领取金额（元）',
      dataIndex: 'amount',
      width: 144,
      render: (_: number) => (_ || _ == 0) ? _/100 : '--'
    },
    {
      title: '使用金额（元）',
      dataIndex: 'usedAmount',
      width: 144,
      render: (_: number) => (_ || _ == 0) ? _/100 : '--'
    },
    {
      title: '消费券状态',
      dataIndex: 'state',
      width: 200,
      render: (_: number) => _ === 2 ? '已过期' : _ === 1 ? '生效中' :  _ === 0 ? '未生效' : '--',
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
            <Col span={6}>
              <Form.Item name="orgName" label="企业名称">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="creditCode" label="统一社会信用代码">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="source" label="名单来源">
                <Select placeholder="请选择" allowClear>
                  <Select.Option value={0}>{listSourceObj[0]}</Select.Option>
                  <Select.Option value={1}>{listSourceObj[1]}</Select.Option>
                  <Select.Option value={2}>{listSourceObj[2]}</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <Form.Item name="city" label="所属地市">
                <Select placeholder="请选择" allowClear>
                  {areaOptions?.map((p: any) => (
                    <Select.Option key={p.code} value={p.code}>
                      {p.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="registerStatus" label="是否注册">
                <Select placeholder="请选择" allowClear>
                  <Select.Option value={1}>是</Select.Option>
                  <Select.Option value={0}>否</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="receiveState" label="领取状态">
                <Select placeholder="请选择" allowClear>
                  <Select.Option value={1}>已领取</Select.Option>
                  <Select.Option value={0}>未领取</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col offset={2} span={4}>
              <Button
                style={{ marginRight: 20 }}
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
          <span>消费券领取及使用情况统计列表</span>
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
