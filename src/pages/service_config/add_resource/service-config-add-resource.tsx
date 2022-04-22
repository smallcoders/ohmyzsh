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
  message,
  Breadcrumb,
} from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import './service-config-add-resource.less';
import scopedClasses from '@/utils/scopedClasses';
import { useEffect, useState } from 'react';
import {
  addOrUpdateAppSource,
  getAppSourceById,
  getAppTypes,
  getTopApps,
} from '@/services/app-resource';
import UploadForm from '@/components/upload_form';
import AppResource from '@/types/app-resource';
import { Link, history, Prompt } from 'umi';
import { routeName } from '../../../../config/routes';

const sc = scopedClasses('service-config-add-resource');
export default () => {
  /**
   * 是否跳转连接 1 跳转 0 不跳
   */
  const [isSkip, setIsSkip] = useState<string | number>(1);
  /**
   * 是否是尖刀应用 1 是 0 不是
   */
  const [isTop, setIsTop] = useState<string | number>(1);
  /**
   * 是否是试用 1 是 0 不是
   */
  const [isTry, setIsTry] = useState<string | number>(1);
  /**
   * 应用资源类型
   */
  const [appTypes, setAppTypes] = useState<{ id: string; name: string }[]>([]);
  /**
   * 尖刀应用类型
   */
  const [topApps, setTopApps] = useState<{ id: string; name: string }[]>([]);
  /**
   * 正在编辑的一行记录
   */
  const [editingItem, setEditingItem] = useState<AppResource.Content>({});

  /**
   * 添加或者修改 loading
   */
  const [addOrUpdateLoading, setAddOrUpdateLoading] = useState<boolean>(false);
  /**
   * 关闭提醒 主要是 添加或者修改成功后 不需要弹出
   */
  const [isClosejumpTooltip, setIsClosejumpTooltip] = useState<boolean>(true);
  /**
   * 是否在编辑
   */
  const isEditing = Boolean(editingItem.id);

  //判断初始的是否尖刀应用并且是否正在修改的开关
  const [isBeginTopAndEditing, setIsBeginTopAndEditing] = useState<boolean>(false);

  const [form] = Form.useForm();

  /**
   * 清楚表单
   */
  // const clearForm = () => {
  //   isEditing && setEditingItem({});
  //   // form.resetFields()
  // };

  /**
   * 准备数据和路由获取参数等
   */
  const prepare = async () => {
    try {
      const prepareResultArray = await Promise.all([getAppTypes(), getTopApps()]);
      setAppTypes(prepareResultArray[0].result);
      setTopApps(prepareResultArray[1].result);

      const { id } = history.location.query as { id: string | undefined };

      if (id) {
        // 获取详情 塞入表单
        const detailRs = await getAppSourceById(id);
        const editItem = { ...detailRs.result };
        if (detailRs.code === 0) {
          editItem.isSkip = detailRs.result.url ? 1 : 0;
          setIsTry(editItem.isSupportTry || 0);
          setIsTop(editItem.isTopApp || 0);
          setIsSkip(editItem.isSkip);

          setIsBeginTopAndEditing(Boolean(editItem.isTopApp));
          setEditingItem(editItem);
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
    window.addEventListener('beforeunload', listener);
    return () => {
      window.removeEventListener('beforeunload', listener);
    };
  }, []);

  /**
   * 添加或者修改
   */
  const addOrUpdate = () => {
    form
      .validateFields()
      .then(async (value: AppResource.Detail) => {
        const tooltipMessage = isEditing ? '修改' : '添加';
        const hide = message.loading(`正在${tooltipMessage}`);
        setAddOrUpdateLoading(true);
        const addorUpdateRes = await addOrUpdateAppSource({
          ...value,
          releaseStatus: 1,
          id: editingItem.id,
        });
        hide();
        if (addorUpdateRes.code === 0) {
          message.success(`${tooltipMessage}成功`);
          setIsClosejumpTooltip(false);

          history.push(routeName.APP_MANAGE);
        } else {
          message.error(`${tooltipMessage}失败，原因:{${addorUpdateRes.message}}`);
        }
        setAddOrUpdateLoading(false);
      })
      .catch((err) => {
        // message.error('服务器错误，请稍后重试');
        console.log(err);
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

  const listener = (e: any) => {
    e.preventDefault();
    e.returnValue = '离开当前页后，所编辑的数据将不可恢复';
  };

  return (
    <PageContainer
      className={sc('container')}
      header={{
        title: isEditing ? `应用编辑` : '添加应用',
        breadcrumb: (
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to="/service-config">服务配置</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to="/service-config/app-manage">应用管理 </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              {isEditing ? `${editingItem.name}应用编辑` : '添加应用'}
            </Breadcrumb.Item>
          </Breadcrumb>
        ),

        extra: (
          <Button type="primary" key="primary" loading={addOrUpdateLoading} onClick={addOrUpdate}>
            确定{isEditing ? '修改' : '新增'}
          </Button>
        ),
      }}
    >
      <Prompt
        when={isClosejumpTooltip && topApps.length > 0}
        message={'离开当前页后，所编辑的数据将不可恢复'}
      />
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
              <Input placeholder="请输入" maxLength={35} />
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
                {/* <Select.Option value={0}>支持试用</Select.Option> */}
                <Select.Option value={1}>热门</Select.Option>
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
              <Input placeholder="请输入" maxLength={35} />
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
                maxSize={5}
                accept=".bmp,.gif,.png,.jpeg,.jpg"
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
                disabled={isBeginTopAndEditing}
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
                {!isBeginTopAndEditing && (
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
                          accept=".bmp,.gif,.png,.jpeg,.jpg"
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
                          accept=".bmp,.gif,.png,.jpeg,.jpg"
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
                <InputNumber
                  placeholder="请输入"
                  step={1}
                  min={1}
                  max={99999999}
                  precision={0}
                  style={{ width: '100%' }}
                />
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
                  // if (e.target.value === 1) {
                  //   // 清空 上传详情
                  //   // form.setFieldsValue({ detailPdfId: undefined });
                  // } else form.setFieldsValue({ url: undefined });
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
                rules={
                  isEditing
                    ? undefined
                    : [
                        {
                          required: true,
                          message: '必填',
                        },
                      ]
                }
              >
                <UploadForm
                  listType="picture-card"
                  className="avatar-uploader"
                  accept=".bmp,.gif,.png,.jpeg,.jpg"
                  showUploadList={false}
                />

                {/* <Upload name="file" accept=".pdf" action="/iiep-manage/common/upload" maxCount={1} beforeUpload={(file) => {
                  if (file.type !== "application/pdf") {
                    message.error(`请上传pdf文件`);
                    return Upload.LIST_IGNORE
                  } else return true
                }}>
                  <Button icon={<UploadOutlined />}>上传文件</Button>
                </Upload> */}
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
