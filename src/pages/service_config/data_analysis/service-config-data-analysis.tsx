import { Button, Table, Row, Col, Form, Input, DatePicker } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import './service-config-data-analysis.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useState } from 'react';

const sc = scopedClasses('service-config-data-analysis');

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
            点击:{item.clickCount || 0} 收藏:{item.collectCount || 0} 试用申请:{item.tryCount || 0}
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

  const [type, setType] = useState<undefined | number>();

  const getIndexs = (): React.ReactNode => {
    return (
      <div className={sc('container-indexs')}>
        <span className={'title'}>当前关键指标</span>
        <div>
          <div>
            <span>点击(次)</span>
            <span>108</span>{' '}
          </div>
          <div>
            <span>收藏(次)</span>
            <span>108</span>{' '}
          </div>
          <div>
            <span>试用申请(次)</span>
            <span>108</span>{' '}
          </div>
        </div>
      </div>
    );
  };

  const getSelfTags = (
    options: { title: string; value?: number }[],
    selected: undefined | number,
    onChange: React.Dispatch<React.SetStateAction<undefined | number>>,
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
      {getIndexs()}
      <div className={sc('container-table-header')}>
        <div className="title">数据指标分析</div>
        <div style={{ padding: '20px 5px' }}>
          {' '}
          <span className={'tag'} style={{ marginRight: 0 }}>
            数据指标：
          </span>{' '}
          {getSelfTags(
            [
              { title: '全部', value: undefined },
              { title: '点击', value: 0 },
              { title: '收藏', value: 1 },
              { title: '试用申请', value: 2 },
            ],
            type,
            setType,
          )}
        </div>
        <Form labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
          <Row>
            <Col span={5}>
              <Form.Item name="orgName" label="企业名称">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item name="publishTime" label="时间区间">
                <DatePicker.RangePicker />
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
      <div className={sc('container-table-body')}>
        <Table pagination={false} bordered columns={columns} dataSource={[]} />
      </div>
    </PageContainer>
  );
};
