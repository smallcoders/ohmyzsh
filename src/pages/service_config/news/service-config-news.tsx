import { PlusOutlined } from '@ant-design/icons';
import { Button, Input, Table, Form, Upload, Modal, Select, Row, Col, DatePicker } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import './service-config-news.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useState } from 'react';

const sc = scopedClasses('service-config-app-news');

export default () => {
  const columns = [
    {
      title: '排序',
      dataIndex: 'sort',
    },
    {
      title: '标题',
      dataIndex: 'title',
    },
    {
      title: '发布时间',
      dataIndex: 'publishTime',
    },
    {
      title: '状态',
      dataIndex: 'state',
    },
    {
      title: '浏览量',
      dataIndex: 'pageViews',
    },
    {
      title: '操作',
      dataIndex: 'option',
      render: () => [
        <a href="javascript:;">编辑</a>,
        <a href="javascript:;">查看</a>,
        <a href="javascript:;">删除</a>,
        <a href="javascript:;">上架</a>,
        <a href="javascript:;">下架</a>,
      ],
    },
  ];
  const [createModalVisible, setModalVisible] = useState<boolean>(false);

  const formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };

  const useSearchNode = (): React.ReactNode => {
    const [searchForm] = Form.useForm();
    return (
      <div className={sc('container-search')}>
        <Form {...formLayout} form={searchForm}>
          <Row>
            <Col span={5}>
              <Form.Item name="title" label="标题">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item name="state" label="状态">
                <Select placeholder="请选择" allowClear>
                  <Select.Option value={0}>发布中</Select.Option>
                  <Select.Option value={1}>待发布</Select.Option>
                  <Select.Option value={2}>已下架</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item
                name="publishTime" // beginPublishTime  endPublishTime
                label="发布时间"
              >
                <DatePicker.RangePicker allowClear />
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

  const useModal = (): React.ReactNode => {
    const [form] = Form.useForm();
    return (
      <Modal
        title={'新增资讯/修改资讯'}
        width="400px"
        visible={createModalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={async () => {
          // await handleAdd(value as API.RuleListItem);
          // if (success) {
          //   handleModalVisible(false);
          //   if (actionRef.current) {
          //     actionRef.current.reload();
          //   }
          // }
        }}
      >
        <Form {...formLayout} form={form} layout="horizontal">
          <Form.Item
            name="coverId"
            label="上传封面"
            valuePropName="fileList"
            // getValueFromEvent={normFile}
          >
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              // beforeUpload={beforeUpload}
              // onChange={this.handleChange}
            >
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>上传</div>
              </div>
            </Upload>
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
                message: '必填',
              },
            ]}
            name="title"
            label="资讯标题"
          >
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item
            name="url"
            label="跳转链接"
            rules={[
              {
                required: true,
                message: '必填',
              },
            ]}
          >
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item name="publishTime" label="发布时间">
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item
            name="contents" // state 	状态0发布中1待发布2已下架
            label="咨询简介"
            rules={[
              {
                required: true,
                message: '必填',
              },
            ]}
          >
            {/* <span> 产品logo或展示效果图，用作应用卡片应用封面展示，建议尺寸
            270*180，大小在5M以下</span> */}
            <Input.TextArea placeholder="请输入" autoSize={{ minRows: 3, maxRows: 5 }} />
          </Form.Item>
        </Form>
      </Modal>
    );
  };

  return (
    <PageContainer className={sc('container')}>
      {useSearchNode()}
      <div className={sc('container-table-header')}>
        <div className="title">
          <span>应用列表(共803个)</span>
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setModalVisible(true);
            }}
          >
            <PlusOutlined /> 新增资讯
          </Button>
        </div>
      </div>
      <div className={sc('container-table-body')}>
        <Table pagination={false} bordered columns={columns} dataSource={[]} />
      </div>
      {useModal()}
    </PageContainer>
  );
};
