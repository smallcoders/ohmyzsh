import {
  Button,
  Input,
  Form,
  Select,
  Row,
  Col,
  DatePicker,
  message,
  Radio,
  Popconfirm,
  Tooltip,
} from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import './index.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { routeName } from '@/../config/routes';
import SelfTable from '@/components/self_table';
import { history, Access, useAccess } from 'umi';

import type Common from '@/types/common';
import type ActivityProject from '@/types/activity-project';
import { getActivityProjectPage, updateMark } from '@/services/activity-project';

const sc = scopedClasses('service_config_activity_project');

// const roleEnum = {
//   EXPERT: '专家',
//   MANAGER: '组织管理员',
//   MEMBER: '组织其他成员',
//   INDIVIDUAL: '普通用户',
// };
// const registerSourceEnum = {
//   WEB: 'web端注册',
//   WECHAT: '微信小程序注册',
//   APP: 'APP',
//   OTHER: '其他终端',
//   WST: '皖事通',
//   WQT: '皖企通',
//   IFLYTEK: '科大讯飞-注册局',
//   TOPOLOGY: '拓普-注册局',
// };

export default () => {
  const [dataSource, setDataSource] = useState<ActivityProject.Content[]>([]);
  const [exchange, setExchange] = useState(false);
  const [selectRows, setSelectRows] = useState<ActivityProject.Content>({});
  const [searchForm] = Form.useForm();
  // 拿到当前角色的access权限兑现
  const access = useAccess()

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
    const search = searchForm.getFieldsValue();
    if (search.time) {
      search.startTime = moment(search.time[0]).format('YYYY-MM-DD HH:mm:ss');
      search.endTime = moment(search.time[1]).format('YYYY-MM-DD HH:mm:ss');
      delete search.time;
    }
    try {
      const params = {
        pageIndex,
        pageSize,
        ...search,
      };

      const { result, totalCount, pageTotal, code } = await getActivityProjectPage(params);
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
  const handleUpdateMark = async () => {
    try {
      const { id } = selectRows;
      const params = {
        id,
        exchange,
      };

      const { message: msg, code } = await updateMark(params);
      if (code === 0) {
        message.success('标注成功');
        getPage();
      } else {
        message.error(msg || `标注失败`);
      }
    } catch (error) {
      console.log(error);
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
      title: '用户ID',
      dataIndex: 'userId',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      width: 150,
      render: (_: string) => (
        <Tooltip placement="top" title={_}>
          <div className="name">{_}</div>
        </Tooltip>
      ),
    },
    {
      title: '手机号',
      dataIndex: 'phone',
    },
    {
      title: '注册时间',
      dataIndex: 'registerTime',
      render: (_: string) => moment(_).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '注册端',
      dataIndex: 'registerSource',
    },
    {
      title: '身份',
      dataIndex: 'role',
    },
    {
      title: '所属组织',
      dataIndex: 'orgName',
    },
    {
      title: '邀请人数',
      dataIndex: 'assistanceCount',
    },
    {
      title: '奖品兑换',
      dataIndex: 'exchange',
      render: (_: boolean) => <span>{_ ? '已兑换' : '未兑换'}</span>,
    },
    {
      title: '操作',
      width: 200,
      dataIndex: 'option',
      fixed: 'right',
      render: (_: any, record: any) => {
        return (
          <>
            <Button
              type="link"
              onClick={() => {
                localStorage.setItem('activity_detail', JSON.stringify(record));
                window.open(`/operation-activity/activity-project/detail`);
              }}
            >
              详情
            </Button>
            <Access accessible={access['P_OA_HDZT']}>
              <Popconfirm
                icon={null}
                title={
                  <div style={{ display: 'grid', gap: 10, marginBottom: 10 }}>
                    <span style={{ fontWeight: '500' }}>奖品兑换标注</span>
                    <Radio.Group
                      onChange={(e) => {
                        setExchange(e.target.value);
                      }}
                      value={exchange}
                    >
                      <Radio value={false}>未兑换</Radio>
                      <Radio value={true}>已兑换</Radio>
                    </Radio.Group>
                  </div>
                }
                okText="确定"
                cancelText="取消"
                onConfirm={() => handleUpdateMark()}
              >
                <Button
                  type="link"
                  onClick={() => {
                    setSelectRows(record);
                    setExchange(record.exchange);
                  }}
                >
                  标注
                </Button>
              </Popconfirm>
            </Access>
          </>
        );
      },
    },
  ];

  useEffect(() => {
    getPage();
  }, []);

  const useSearchNode = (): React.ReactNode => {
    return (
      <div className={sc('container-search')}>
        <Form {...formLayout} form={searchForm}>
          <Row>
            <Col span={8}>
              <Form.Item name="phone" label="手机号">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="time" label="注册时间范围">
                <DatePicker.RangePicker allowClear showTime />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="name" label="姓名">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <Form.Item name="orgName" label="所属组织">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="identity" label="身份">
                <Select placeholder="请选择" allowClear>
                  <Select.Option value={'EXPERT'}>已认证专家</Select.Option>
                  <Select.Option value={'ORG_MEMBER'}>组织其他成员</Select.Option>
                  <Select.Option value={'ORG_MANAGER'}>组织管理员</Select.Option>
                  <Select.Option value={'INDIVIDUAL'}>普通用户</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8} style={{ textAlign: 'right' }}>
              <Button
                style={{ marginRight: 20 }}
                type="primary"
                key="search"
                onClick={() => {
                  getPage();
                }}
              >
                查询
              </Button>
              <Button
                type="primary"
                key="reset"
                onClick={() => {
                  searchForm.resetFields();
                  getPage();
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
          <span>审核列表(共{pageInfo.totalCount || 0}个)</span>
        </div>
      </div>
      <div className={sc('container-table-body')}>
        <SelfTable
          bordered
          scroll={{ x: 1500 }}
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
