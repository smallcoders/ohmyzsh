import SelfTable from '@/components/self_table';
import Common from '@/types/common.d';
import { PageContainer } from '@ant-design/pro-layout';
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  message as antdMessage,
  Row,
  Select,
  Space,
} from 'antd';
import { routeName } from '../../../../config/routes';
import React, { useEffect, useState } from 'react';
import { history } from 'umi';
import { getAreaTree } from '@/services/area';
import './index.less';
import scopedClasses from '@/utils/scopedClasses';
import moment from 'moment';
import AuthenticationInfo from '@/types/authentication-info.d';
import { getAuthenticationInfoPage } from '@/services/authentication-info';
const sc = scopedClasses('user-config-authentication-info');
export default () => {
  const [activeKey, setActiveKey] = useState<AuthenticationInfo.AuthenticationType>(
    AuthenticationInfo.AuthenticationType.ENTERPRISE,
  );

  const [dataSource, setDataSource] = useState<AuthenticationInfo.Content[]>([]);
  const [searchContent, setSearChContent] = useState<AuthenticationInfo.SearchBody>({});

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
  const [areaOptions, setAreaOptions] = useState<any>([]);
  useEffect(() => {
    try {
      getAreaTree({}).then((data) => {
        setAreaOptions(data?.children || []);
      });
      // getDictionay('EXPERT_DICT').then((data) => {
      //   setExpertType(data.result || []);
      // });
    } catch (error) {
      antdMessage.error('数据初始化错误');
    }
  }, []);

  const getPage = async (pageIndex: number = 1, pageSize = pageInfo.pageSize) => {
    try {
      const { result, totalCount, pageTotal, code, message } = await getAuthenticationInfoPage({
        pageIndex,
        pageSize,
        ...searchContent,
        auditType: activeKey,
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
      render: (_: any, _record: AuthenticationInfo.Content, index: number) =>
        pageInfo.pageSize * (pageInfo.pageIndex - 1) + index + 1,
    },
    {
      title: '企业名称',
      dataIndex: 'orgName',
      width: 150,
      isEllipsis: true,
    },
    {
      title: '用户名',
      dataIndex: 'userName',
      isEllipsis: true,
      width: 150,
    },
    {
      title: '认证时间',
      dataIndex: 'createTime',
      isEllipsis: true,
      render: (_: string) => moment(_).format('YYYY-MM-DD HH:mm:ss'),
      width: 200,
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      isEllipsis: true,
      width: 150,
    },
    {
      title: '所属区域',
      dataIndex: 'area',
      isEllipsis: true,
      width: 150,
    },
    {
      title: '操作',
      width: 200,
      dataIndex: 'option',
      fixed: 'right',
      render: (_: any, record: any) => {
        return (
          <div style={{ textAlign: 'center' }}>
            <Space size={20}>
              <Button
                type="link"
                onClick={() => {
                  history.push(
                    `${routeName.AUTHENTICATION_INFO_DETAIL}?id=${record.id}&type=${activeKey}`,
                  );
                }}
              >
                编辑
              </Button>
            </Space>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    getPage();
  }, [searchContent, activeKey]);

  const useSearchNode = (): React.ReactNode => {
    const [searchForm] = Form.useForm();
    return (
      <div className={sc('container-search')}>
        <Form {...formLayout} form={searchForm}>
          <Row>
            <Col span={8}>
              <Form.Item name="orgName" label="认证名称">
                <Input placeholder="企业/服务机构/专家名称" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="userName" label="用户名">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="time" label="认证时间">
                <DatePicker.RangePicker allowClear showTime />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <Form.Item name="phone" label="手机号">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="areaCode" label="所属区域">
                <Select placeholder="请选择" allowClear>
                  {areaOptions?.map((item: any) => (
                    <Select.Option key={item?.code} value={Number(item?.code)}>
                      {item?.name}
                    </Select.Option>
                  ))}
                </Select>
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
                    search.startDate = moment(search.time[0]).format('YYYY-MM-DD HH:mm:ss');
                    search.endDate = moment(search.time[1]).format('YYYY-MM-DD HH:mm:ss');
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
    <PageContainer
      header={{
        children: useSearchNode(),
      }}
      tabList={[
        {
          tab: '工业企业',
          key: AuthenticationInfo.AuthenticationType.ENTERPRISE,
        },
        {
          tab: '服务机构',
          key: AuthenticationInfo.AuthenticationType.SERVICE_PROVIDER,
        },
        {
          tab: '专家',
          key: AuthenticationInfo.AuthenticationType.EXPERT,
        },
      ]}
      tabActiveKey={activeKey}
      onTabChange={(key: any) => setActiveKey(key)}
    >
      <div className={sc('container-table-header')}>
        <div className="title">
          <span>认证账号列表(共{pageInfo.totalCount || 0}个)</span>
        </div>
      </div>
      <div className={sc('container-table-body')}>
        <SelfTable
          bordered
          scroll={{ x: 1480 }}
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
    </PageContainer>
  );
};
