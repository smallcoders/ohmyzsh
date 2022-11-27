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
  TreeSelect,
} from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import './index.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { routeName } from '@/../config/routes';
import SelfTable from '@/components/self_table';
import { Access, useAccess } from 'umi';
import { getDemandPage } from '@/services/kc-verify';
import { getDictionaryTree } from '@/services/dictionary';
import Common from '@/types/common';
import NeedVerify from '@/types/user-config-need-verify';
import { handleAudit } from '@/services/audit';
// import { getDictionaryTree } from '@/services/dictionary';
const sc = scopedClasses('service-config-app-news');
const stateObj = {
  AUDITING: '审核中',
  AUDIT_PASSED: '已通过',
  AUDIT_REJECTED: '已拒绝',
};
enum Edge {
  HOME = 0, // 新闻咨询首页
}
export default () => {
  const [dataSource, setDataSource] = useState<NeedVerify.Content[]>([]);
  const [refuseContent, setRefuseContent] = useState<string>('');
  const [types, setTypes] = useState<any[]>([]);
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
    [Edge.HOME]: 'PQ_AT_CXXQ', // 创新需求-页面查询
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
    pageSize: 20,
    totalCount: 0,
    pageTotal: 0,
  });

  // const [form] = Form.useForm();

  const getPage = async (pageIndex: number = 1, pageSize = pageInfo.pageSize) => {
    try {
      const { result, totalCount, pageTotal, code } = await getDemandPage({
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
      const res = await getDictionaryTree('CREATIVE_TYPE');
      setTypes(res);
    } catch (error) {
      message.error('获取行业类型失败');
    }
  };
  useEffect(() => {
    prepare();
  }, []);

  const editState = async (record: any, { ...rest }) => {
    try {
      const tooltipMessage = rest.result ? '审核通过' : '审核拒绝';
      const updateStateResult = await handleAudit({
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
      render: (_: any, _record: NeedVerify.Content, index: number) =>
        pageInfo.pageSize * (pageInfo.pageIndex - 1) + index + 1,
    },
    {
      title: '需求名称',
      dataIndex: 'name',
      render: (_: string, _record: any) => (
        <a
          href="#!"
          onClick={(e) => {
            e.preventDefault(); 
            window.open(`${routeName.NEED_VERIFY_DETAIL}?id=${_record.id}&state=${_record.auditState}`);
          }}
        >
          {_}
        </a>
      ),
      width: 300,
    },
    {
      title: '所属行业',
      dataIndex: 'type',
      isEllipsis: true,
      width: 300,
    },
    {
      title: '用户名',
      dataIndex: 'userName',
      isEllipsis: true,
      width: 300,
    },
    {
      title: '提交时间',
      dataIndex: 'submitDateTime',
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
      title: '审核',
      width: 200,
      dataIndex: 'option',
      fixed: 'right',
      render: (_: any, record: any) => {
        const accessible = access?.[permissions?.[edge].replace(new RegExp("Q"), "")]
        return record.auditState === 'AUDITING' ? (
          <Access accessible={accessible}>
            <Space size={20}>
              <Button type="link" onClick={() => editState(record, { result: true })}>
                通过
              </Button>
              <Popconfirm
                icon={null}
                title={
                  <>
                    意见说明（非必填）
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
          </Access>
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
              <Form.Item name="type" label="所属行业">
                <TreeSelect
                  showSearch
                  treeNodeFilterProp="name"
                  style={{ width: '100%' }}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  treeData={types}
                  placeholder="请选择"
                  fieldNames={{ label: 'name', value: 'id', children: 'children' }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="userName" label="用户名">
                <Input placeholder="请输入" />
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
              <Form.Item name="auditState" label="审核状态">
                <Select placeholder="请选择" allowClear>
                  <Select.Option value={'AUDITING'}>待审核</Select.Option>
                  <Select.Option value={'AUDIT_PASSED'}>通过</Select.Option>
                  <Select.Option value={'AUDIT_REJECTED'}>拒绝</Select.Option>
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
                    search.startDateTime = moment(search.time[0]).format('YYYY-MM-DDTHH:mm:ss');
                    search.endDateTime = moment(search.time[1]).format('YYYY-MM-DDTHH:mm:ss');
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
          <span>需求列表(共{pageInfo.totalCount || 0}个)</span>
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
