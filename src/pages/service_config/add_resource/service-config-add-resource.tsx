/* eslint-disable */
import {
  Button,
  Input,
  Form,
  Select,
  InputNumber,
  Row,
  Col,
  Radio,
  Upload,
  message,
  Breadcrumb,
} from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import './service-config-add-resource.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useEffect, useState } from 'react';
import {
  addOrUpdateAppSource,
  getAppSourceById,
  getAppTypes,
  getTopApps,
} from '@/services/app-resource';
import { UploadOutlined } from '@ant-design/icons';
import UploadForm from './upload-form';
import AppResource from '@/types/app-resource';
import { Link, history } from 'umi';
const sc = scopedClasses('service-config-add-resource');
export default () => {
  const [isSkip, setIsSkip] = useState<string | number>(1);
  const [isTop, setIsTop] = useState<string | number>(1);
  const [isTry, setIsTry] = useState<string | number>(1);
  const [appTypes, setAppTypes] = useState<{ id: string; name: string }[]>([]);
  const [topApps, setTopApps] = useState<{ id: string; name: string }[]>([]);
  const [editingItem, setEditingItem] = useState<AppResource.Content>({});
  const [addOrUpdateLoading, setAddOrUpdateLoading] = useState<boolean>(false);
  const isEditing = Boolean(editingItem.id);
  // /**
  //  * 上传按钮的loading
  //  */
  // const [uploadLoadingLogo, setUploadLoadingLogo] = useState<boolean>(false); // 应用logo 上传loading
  // const [uploadLoadingIconDefault, setUploadLoadingIconDefault] = useState<boolean>(false); // 应用icon 默认 上传loading
  // const [uploadLoadingLogoIconHover, setUploadLoadingLogoIconHover] = useState<boolean>(false); // 应用icon hover 上传loading

  const [form] = Form.useForm();

  const clearForm = () => {
    editingItem.id && setEditingItem({});
  };

  const prepare = async () => {
    try {
      const prepareResultArray = await Promise.all([getAppTypes(), getTopApps()]);
      setAppTypes(prepareResultArray[0].result);
      setTopApps(prepareResultArray[1].result);

      const { id } = history.location.query;

      if (id) {
        // 获取详情 塞入表单
        const detailRs = await getAppSourceById(id);
        if (detailRs.code === 0) {
          if (detailRs.result.detailPdfId) {
            detailRs.result.detailPdfId = [
              {
                uid: detailRs.result.detailPdfId,
                name: detailRs.result.detailPdfId + '.pdf',
                status: 'done',
                url: `/iiep-manage/common/download/${detailRs.result.detailPdfId}`,
              },
            ];
          }
          detailRs.result.isSkip = detailRs.result.url ? 1 : 0;
          setIsTry(detailRs.result.isSupportTry || 0);
          setIsTop(detailRs.result.isTopApp || 0);
          setIsSkip(detailRs.result.isSkip);
          setEditingItem(detailRs.result);
          // form.setFieldsValue({ ...detailRs.result })
        } else {
          message.error(`获取详情失败，原因:{${detailRs.message}}`);
        }
      }
    } catch (error) {
      console.log('error', error);
      message.error('获取初始数据失败');
    }
  };

  useEffect(() => {
    prepare();
  }, []);

  const addOrUpdate = () => {
    form
      .validateFields()
      .then(async (value) => {
        const tooltipMessage = editingItem.id ? '修改' : '添加';
        const hide = message.loading(`正在${tooltipMessage}`);
        setAddOrUpdateLoading(true);
        if (value.detailPdfId) {
          value.detailPdfId = value.detailPdfId[0]?.response?.result;
        }
        const addorUpdateRes = await addOrUpdateAppSource({
          ...value,
          releaseStatus: 1,
          id: editingItem.id,
        });
        if (addorUpdateRes.code === 0) {
          hide();
          message.success(`${tooltipMessage}成功`);
          clearForm();
        } else {
          hide();
          message.error(`${tooltipMessage}失败，原因:{${addorUpdateRes.message}}`);
        }
        setAddOrUpdateLoading(false);
      })
      .catch((err) => {
        console.log(err);
        return;
      });
  };

  // 额外的副作用 用来解决表单的设置
  useEffect(() => {
    form.setFieldsValue({ ...editingItem });
  }, [editingItem]);

  const formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 14 },
  };

  const normFile = (e: any) => {
    return e && e.fileList;
  };

  return (
    <PageContainer
      className={sc('container')}
      header={{
        title: isEditing ? '修改应用' : '添加应用',
        breadcrumb: (
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to="/service-config">服务配置</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to="/service-config/app-resource">应用资源</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{isEditing ? '修改应用' : '添加应用'}</Breadcrumb.Item>
          </Breadcrumb>
        ),

        extra: (
          <Button type="primary" key="primary" loading={addOrUpdateLoading} onClick={addOrUpdate}>
            确定{isEditing ? '修改' : '新增'}
          </Button>
        ),
      }}
    >
      <Form className={sc('container-form')} {...formLayout} form={form}>
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
                {appTypes.map((p) => (
                  <Select.Option key={'type' + p.id} value={p.id}>
                    {p.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="label" label="应用标签">
              <Select placeholder="请选择" allowClear>
                <Select.Option value={0}>支持试用</Select.Option>
                <Select.Option value={1}>平台精选</Select.Option>
                <Select.Option value={2}>其他</Select.Option>
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
              <Input.TextArea
                placeholder="请输入"
                autoSize={{ minRows: 3, maxRows: 5 }}
                showCount
                maxLength={200}
              />
            </Form.Item>
            <Form.Item
              name="cover"
              label="应用logo"
              rules={[
                {
                  required: true,
                  message: '必填',
                },
              ]}
            >
              <UploadForm
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                tooltip={
                  <span className={'tooltip'}>
                    产品logo或展示效果图，用作应用卡片应用封面展示，建议尺寸 270*180，大小在5M以下
                  </span>
                }
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="isTopApp"
              label="设为尖刀应用"
              initialValue={1}
              rules={[
                {
                  required: true,
                  message: '必填',
                },
              ]}
            >
              <Radio.Group
                disabled={isEditing && Boolean(editingItem.isTopApp)}
                onChange={(e) => {
                  form.setFieldsValue({
                    replaceAppId: undefined,
                    shortName: undefined,
                    defaultIconId: undefined,
                    hoverIconId: undefined,
                  });
                  setIsTop(e.target.value);
                }}
              >
                <Radio value={1}>是</Radio>
                <Radio value={0}>否</Radio>
              </Radio.Group>
            </Form.Item>
            {isTop ? (
              <>
                {!isEditing && Boolean(editingItem.isTopApp) && (
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
                      {topApps.map((p) => (
                        <Select.Option value={p.id} key={'replaceAppId' + p.id}>
                          {p.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                )}
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
                  name=""
                  label="应用icon"
                  rules={[
                    {
                      required: true,
                      // message: '必填',
                      validator: () => {
                        if (
                          form.getFieldValue('defaultIconId') &&
                          form.getFieldValue('hoverIconId')
                        ) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('请上传'));
                      },
                    },
                  ]}
                >
                  <span className={'tooltip'}>
                    首页尖刀应用展示icon，上传的左图为默认状态，右图为hover状态
                  </span>
                  <Row>
                    <Col span={7}>
                      <Form.Item
                        name="defaultIconId" // hoverIconId
                      >
                        <UploadForm
                          listType="picture-card"
                          className="avatar-uploader"
                          showUploadList={false}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={7}>
                      <Form.Item
                        name="hoverIconId" // hoverIconId
                      >
                        <UploadForm
                          listType="picture-card"
                          className="avatar-uploader"
                          showUploadList={false}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Form.Item>
              </>
            ) : (
              ''
            )}
            <Form.Item
              name="isSupportTry"
              label="支持试用"
              rules={[
                {
                  required: true,
                  message: '必填',
                },
              ]}
              initialValue={1}
            >
              <Radio.Group
                onChange={(e) => {
                  form.setFieldsValue({ tryTime: undefined });
                  setIsTry(e.target.value);
                }}
              >
                <Radio value={1}>是</Radio>
                <Radio value={0}>否</Radio>
              </Radio.Group>
            </Form.Item>
            {isTry ? (
              <Form.Item name="tryTime" label="试用周期（天）">
                <Input placeholder="请输入" />
              </Form.Item>
            ) : (
              ''
            )}
            <Form.Item
              name="isSkip"
              label="跳转到外部链接"
              rules={[
                {
                  required: true,
                  message: '必填',
                },
              ]}
              initialValue={1}
            >
              <Radio.Group
                onChange={(e) => {
                  setIsSkip(e.target.value);
                  if (e.target.value === 1) {
                    // 清空 上传详情
                    form.setFieldsValue({ detailPdfId: undefined });
                  } else form.setFieldsValue({ url: undefined });
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
                name="detailPdfId"
                label="上传详情"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                rules={[
                  {
                    required: true,
                    message: '必填',
                  },
                ]}
              >
                <Upload name="file" action="/iiep-manage/common/upload" maxCount={1}>
                  <Button icon={<UploadOutlined />}>上传文件</Button>
                </Upload>
                {/* <UploadForm
                  name="file"
                  action="/iiep-manage/common/upload"
                  listType="picture"
                >
                  <Button icon={<UploadOutlined />}>上传文件</Button>
                </UploadForm> */}
              </Form.Item>
            )}
          </Col>
        </Row>
      </Form>
    </PageContainer>
  );
};
