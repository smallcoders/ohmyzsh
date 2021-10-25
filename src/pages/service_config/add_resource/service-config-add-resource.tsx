import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Input, Form, Upload, Select, InputNumber, Row, Col, Radio } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import './service-config-add-resource.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useState } from 'react';

const sc = scopedClasses('service-config-add-resource');

export default () => {
  const [isSkip, setIsSkip] = useState<string | number>(1);
  // const [tag, setTag] = useState<string | number>("")

  // const [form] = Form.useForm()

  const formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 14 },
  };

  return (
    <PageContainer
      className={sc('container')}
      header={{
        extra: (
          <Button type="primary" key="primary" onClick={() => {}}>
            确定新增
          </Button>
        ),
      }}
    >
      <Form className={sc('container-form')} {...formLayout}>
        <Row>
          <Col span={12}>
            <Form.Item
              name="name"
              label="应用名称"
              rules={[
                {
                  required: true,
                  message: '必填',
                },
              ]}
            >
              <Input placeholder="请输入" />
            </Form.Item>
            <Form.Item
              name="type"
              label="应用类型"
              rules={[
                {
                  required: true,
                  message: '必填',
                },
              ]}
            >
              <Select placeholder="请选择">
                <Select.Option value={1}>PC</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="label" label="应用标签">
              <Select placeholder="请选择" allowClear>
                <Select.Option value={1}>平台精选</Select.Option>
                <Select.Option value={0}>其他</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="orgName"
              label="所属厂商"
              rules={[
                {
                  required: true,
                  message: '必填',
                },
              ]}
            >
              <Input placeholder="请输入" />
            </Form.Item>
            <Form.Item name="priority" label="应用顺序">
              <InputNumber
                style={{ width: '100%' }}
                placeholder="请输入"
                step={1}
                min={1}
                max={99999999}
                precision={0}
              />
            </Form.Item>
            <Form.Item
              name="context"
              label="应用简介"
              rules={[
                {
                  required: true,
                  message: '必填',
                },
              ]}
            >
              <Input.TextArea placeholder="请输入" autoSize={{ minRows: 3, maxRows: 5 }} />
            </Form.Item>
            <Form.Item
              name="cover"
              label="应用logo"
              valuePropName="fileList"
              rules={[
                {
                  required: true,
                  message: '必填',
                },
              ]}
              // getValueFromEvent={normFile}
            >
              <span className={'tooltip'}>
                产品logo或展示效果图，用作应用卡片应用封面展示，建议尺寸 270*180，大小在5M以下
              </span>
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
          </Col>
          <Col span={12}>
            <Form.Item
              name="isTopApp"
              label="设为尖刀应用"
              rules={[
                {
                  required: true,
                  message: '必填',
                },
              ]}
            >
              <Radio.Group defaultValue={1}>
                <Radio value={1}>是</Radio>
                <Radio value={0}>否</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              name="replaceAppId"
              label="替换目标"
              rules={[
                {
                  required: true,
                  message: '必填',
                },
              ]}
            >
              <Select placeholder="请选择">
                <Select.Option value={1}>PC</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="shortName"
              label="应用简称"
              rules={[
                {
                  required: true,
                  message: '必填',
                },
              ]}
            >
              <Input placeholder="请输入" maxLength={6} />
            </Form.Item>
            <Form.Item
              name="defaultIconId" // hoverIconId
              label="应用icon"
              rules={[
                {
                  required: true,
                  message: '必填',
                },
              ]}
            >
              <span className={'tooltip'}>
                首页尖刀应用展示icon，上传的左图为默认状态，右图为hover状态
              </span>
              <Row>
                <Col span={6}>
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
                </Col>
                <Col span={6}>
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
                </Col>
              </Row>
            </Form.Item>
            <Form.Item
              name="isSupportTry"
              label="支持试用"
              rules={[
                {
                  required: true,
                  message: '必填',
                },
              ]}
            >
              <Radio.Group defaultValue={1}>
                <Radio value={1}>是</Radio>
                <Radio value={0}>否</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item name="tryTime" label="试用周期（天）">
              <Input placeholder="请输入" />
            </Form.Item>
            <Form.Item
              name="isSkip"
              label="跳转到外部链接"
              rules={[
                {
                  required: true,
                  message: '必填',
                },
              ]}
            >
              <Radio.Group
                defaultValue={1}
                onChange={(e) => {
                  setIsSkip(e.target.value);
                }}
              >
                <Radio value={1}>是</Radio>
                <Radio value={0}>否</Radio>
              </Radio.Group>
            </Form.Item>
            {isSkip ? (
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
            ) : (
              <Form.Item
                name="detailPdfId" //releaseStatus 发布状态  1 发布
                label="上传详情"
                rules={[
                  {
                    required: true,
                    message: '必填',
                  },
                ]}
              >
                <Button icon={<UploadOutlined />}>上传文件</Button>
              </Form.Item>
            )}
          </Col>
        </Row>
      </Form>
    </PageContainer>
  );
};
