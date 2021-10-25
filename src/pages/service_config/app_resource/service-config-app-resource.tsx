import { PlusOutlined } from '@ant-design/icons';
import { Button, Input, Table, Form, Select, Row, Col } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import './service-config-app-resource.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useState } from 'react';
import { history } from 'umi';

const sc = scopedClasses('service-config-app-resource');

export default () => {
  const columns = [
    {
      title: '排序',
      dataIndex: 'sort',
    },
    {
      title: '应用名称',
      dataIndex: 'name',
    },
    {
      title: '应用类型',
      dataIndex: 'type',
    },
    {
      title: '应用标签',
      dataIndex: 'label',
    },
    {
      title: '所属厂商',
      dataIndex: 'orgName',
    },
    {
      title: '尖刀应用',
      dataIndex: 'excellent',
    },
    {
      title: '状态',
      dataIndex: 'isRelease',
    },
    {
      title: '数据分析(次)',
      dataIndex: 'dataAnalyseKeyQuotaV',
      render: (item: { clickCount: number; collectCount: number; tryCount: number }) => {
        return (
          <div>
            点击：{item.clickCount || 0} 收藏：{item.collectCount || 0} 试用申请：
            {item.tryCount || 0}
          </div>
        );
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      render: () => [
        <a href="javascript:;">编辑</a>,
        <a href="javascript:;">删除</a>,
        <a href="javascript:;">下架</a>,
        <a href="javascript:;">置顶</a>,
      ],
    },
  ];

  const [type, setType] = useState<string | number>('');
  const [tag, setTag] = useState<string | number>('');

  const getSearchNode = (): React.ReactNode => {
    const formLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    return (
      <div className={sc('container-search')}>
        <Form {...formLayout}>
          <Row>
            <Col span={5}>
              <Form.Item name="belong" label="应用名称">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item name="belong" label="所属厂商">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item
                name="belong"
                label="尖刀应用"
                rules={[
                  {
                    required: true,
                    message: '必填',
                  },
                ]}
              >
                <Select placeholder="请选择">
                  <Select.Option value={0}>否</Select.Option>
                  <Select.Option value={1}>是</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item
                name="belong"
                label="当前状态"
                rules={[
                  {
                    required: true,
                    message: '必填',
                  },
                ]}
              >
                <Select placeholder="请选择">
                  <Select.Option value={0}>已下架</Select.Option>
                  <Select.Option value={1}>发布中</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Button style={{ marginRight: 20 }} type="primary" key="primary" onClick={() => {}}>
                查询
              </Button>
              <Button type="primary" key="primary" onClick={() => {}}>
                重置
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    );
  };

  const getSelfTags = (
    options: { title: string; value: string | number | undefined }[],
    selected: string | number,
    onChange: React.Dispatch<React.SetStateAction<string | number>>,
  ): React.ReactNode =>
    options.map((p) => (
      <span
        onClick={() => onChange(p.value)}
        className={p.value === selected ? 'tag tag-selected' : 'tag'}
      >
        {p.title}
      </span>
    ));

  return (
    <PageContainer className={sc('container')}>
      {getSearchNode()}
      <div className={sc('container-table-header')}>
        <div className="title">
          <span>应用列表(共803个)</span>
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              history.push(`/service-config/app-resource/add-resource/${1111}`);
            }}
          >
            <PlusOutlined /> 新增
          </Button>
        </div>
        <Row style={{ padding: '5px 0' }}>
          {' '}
          <span className={'tag'} style={{ marginRight: 0 }}>
            类型：
          </span>{' '}
          {getSelfTags(
            [
              { title: '全部', value: undefined },
              { title: '安全生产', value: 1 },
            ],
            type,
            setType,
          )}
        </Row>
        <Row style={{ padding: '5px 0' }}>
          {' '}
          <span className={'tag'} style={{ marginRight: 0 }}>
            标签：
          </span>{' '}
          {getSelfTags(
            [
              { title: '全部', value: undefined },
              { title: '支持试用', value: 0 },
              { title: '平台精选', value: 1 },
              { title: '其他', value: 2 },
            ],
            tag,
            setTag,
          )}
        </Row>
      </div>
      <div className={sc('container-table-body')}>
        <Table pagination={false} bordered columns={columns} dataSource={[]} />
      </div>
    </PageContainer>
  );
};
