import {PageContainer} from "@ant-design/pro-layout";
import React, {useState} from "react";
import {Button, Col, Form, Input, message, Popconfirm, Row, Select, Space, Switch, Table} from "antd";
import moment from "moment/moment";
import './index.less';
import scopedClasses from "@/utils/scopedClasses";
import Activity from "@/types/operation-activity";
import {history} from "@@/core/history";
import {routeName} from "../../../../config/routes";
const sc = scopedClasses('column-manage');
export default () => {
  // const [dataSource, setDataSource] = useState<any>([]);
  const dataSource=[
    {name:'nihao',intro:'rewq1',started:true,num:2341},
    {name:'nihao1',intro:'rewq2',started:false,num:2341},
    {name:'nihao2',intro:'rewq3',started:true,num:2341},
    {name:'nihao3',intro:'rewq4',started:false,num:2341},
  ]
  const [searchContent, setSearChContent] = useState<{
    activeName?: string; // 活动名称
    startTime?: string; // 活动时间
    endTime?: string; // 活动时间
    activeChannelId?: number; // 状态：0发布中、1待发布、2已下架
    activeSceneId?: number; // 状态：0发布中、1待发布、2已下架
  }>({});
  const [pageInfo, setPageInfo] = useState({
    pageIndex: 1,
    pageSize: 10,
    total: 1,
  });

  const useSearchNode = (): React.ReactNode => {
    const [searchForm] = Form.useForm();
    const formLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    };
    return (
      <div className={sc('container-search')}>
        <Form {...formLayout} form={searchForm}>
          <Row>
            <Col span={8}>
              <Form.Item name="columnName" label="专栏名称">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="state" label="上下架状态">
                  <Select placeholder="请选择" allowClear>
                    <Select.Option value={'AUDIT_PASSED'}>上架</Select.Option>
                    <Select.Option value={'AUDIT_REJECTED'}>下架</Select.Option>
                  </Select>
                </Form.Item>
            </Col>
            <Col span={8}>
              <Button
                style={{ marginRight: 20, marginLeft: 20 }}
                type="primary"
                key="search"
                onClick={() => {
                  const search = searchForm.getFieldsValue();
                  const { time, ...rest } = search;
                  console.log(time)
                  if (time) {
                    rest.startTime = moment(search.time[0]).format('YYYY-MM-DD');
                    rest.endTime = moment(search.time[1]).format('YYYY-MM-DD');
                  }
                  setSearChContent(rest);
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
  const columns = [
    {
      title: '顺序序号',
      dataIndex: 'sort',
      key: 'sort',
      width:120,
      render: (_: any, _record: any, index: number) =>
        pageInfo.pageSize * (pageInfo.pageIndex - 1) + index + 1,
    },
    {
      title: '专栏名字',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '专栏介绍',
      dataIndex: 'intro',
      key: 'intro',
    },
    {
      title: '上下架状态',
      key: 'started',
      dataIndex: 'started',
      width:100,
      render: (started: boolean) => {
        return (
              <Switch  style={{ marginRight: 20 }} checked={started}  />
        )
      }
    },
    {
      title: '点击量',
      dataIndex: 'num',
      key: 'num',
      width:80,
    },
    {
      title: '操作',
      key: 'action',
      render: () => {
        return (
          <Space size="middle">
            <a
              onClick={() => {
                history.push(`/science-technology-manage/column-manage/detail`);
              }}
            >查看</a>
            <a
              onClick={() => {
                history.push(`/science-technology-manage/column-manage/edit`);
              }}
            >编辑</a>
            <Popconfirm
              title="确定删除？"
              okText="确定"
              cancelText="取消"
            >
              <a>删除</a>
            </Popconfirm>
          </Space>
        )
      }
    }
  ].filter(p => p);

  return(
    <PageContainer className={sc('container')}>
      {useSearchNode()}
      <div style={{ backgroundColor: '#fff', padding: 20 }}>
        <div className={sc('container-header')}>
            <Button
              type="primary"
              key="newAdd"
              onClick={() => {
              }}
            >
              新增专栏
            </Button>
        </div>
        <div className={sc('container-body')}>
          <Table
            bordered
            columns={columns}
            dataSource={dataSource}
            rowKey={'id'}
            pagination={
              pageInfo.total === 0
                ? false
                : {
                  total: pageInfo.total,
                  current: pageInfo.pageIndex,
                  pageSize: pageInfo.pageSize,
                  showTotal: (total) =>
                    `共${total}条记录 第${pageInfo.pageIndex}/${Math.ceil(pageInfo.total / pageInfo.pageSize) || 1}页`,
                }
            }
          />
        </div>
      </div>
    </PageContainer>
  )
}
