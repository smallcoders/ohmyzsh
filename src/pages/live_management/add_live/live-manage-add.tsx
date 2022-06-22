/* eslint-disable */
import {
  Button,
  Input,
  Form,
  Select,
  Checkbox,
  Row,
  Col,
  Radio,
  message,
  Breadcrumb,
  DatePicker,
  Image,
  Tag
} from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import './live-manage-add.less';
import scopedClasses from '@/utils/scopedClasses';
import { useEffect, useState } from 'react';
import {
  addOrUpdateAppSource,
  getAppTypes,
  getTopApps,
} from '@/services/app-resource';
import {
  getVideoDetail,
} from '@/services/search-record';
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
   * 详情记录
   */
   const [isDetail, setIsDetail] = useState<boolean>(false);

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
  const isEditing = Boolean(editingItem.id && !isDetail);

  //判断初始的是否尖刀应用并且是否正在修改的开关
  const [isBeginTopAndEditing, setIsBeginTopAndEditing] = useState<boolean>(false);

  const [form] = Form.useForm();

  const stateObj = {
    0: '未开始',
    1: '直播中',
    2: '已结束'
  };
  const { CheckableTag } = Tag;

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

      const { id, isDetail } = history.location.query as { id: string | undefined, isDetail: string | undefined };

      if (id) {
        // 获取详情 塞入表单
        const detailRs = await getVideoDetail(id);
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
      if(isDetail == '1') {
        setIsDetail(true);
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
    labelCol: { span: 6 },
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
        title: isEditing ? `编辑直播` : isDetail ? '直播详情' : '新增直播',
        breadcrumb: (
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to="/live-manage/antelope_live_management">羚羊直播管理 </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              {isEditing ? `编辑直播` : isDetail ? '直播详情' : '新增直播'}
            </Breadcrumb.Item>
          </Breadcrumb>
        ),

        extra: (
          <div className="operate-btn">
            {!isDetail && (
              <Button key="primary" loading={addOrUpdateLoading} onClick={addOrUpdate}>
                取消
              </Button>
            )}
            {!isDetail && !isEditing && (
              <Button key="primary" loading={addOrUpdateLoading} onClick={addOrUpdate}>
                保存并上架
              </Button>
            )}
            {!isDetail && (
              <Button type="primary" key="primary" loading={addOrUpdateLoading} onClick={addOrUpdate}>
                保存
              </Button>
            )}
            {isDetail && (
              <Button key="primary" loading={addOrUpdateLoading} onClick={addOrUpdate}>
                返回
              </Button>
            )}
          </div>
        ),
      }}
    >
      <Prompt
        when={isClosejumpTooltip && topApps.length > 0}
        message={'离开当前页后，所编辑的数据将不可恢复'}
      />
      <Form className={sc('container-form')} {...formLayout} form={form}>
        <Row>
          <Col span={18}>
            <Form.Item
              name="title"
              label="直播间名称"
              rules={[
                {
                  required: !isDetail,
                  message: '必填',
                },
              ]}
            > 
              {isDetail ? (
                <span>{editingItem?.title || '--'}</span>
              ) : (
                <Input placeholder="请输入" maxLength={35} />
              )}
              
            </Form.Item>
          </Col>
          {isDetail && (
            <Col span={18}>
            <Form.Item
              name="videoStatus"
              label="状态"
            > 
              <span>
              <CheckableTag
                key='tag1'
                checked={editingItem.videoStatus}
              >
                {Object.prototype.hasOwnProperty.call(stateObj, stateObj[editingItem.videoStatus])}
              </CheckableTag>
              <CheckableTag
                key='tag2'
                checked={editingItem.lineStatus}
              >
                {editingItem.lineStatus ? '线上' : '线下'}
              </CheckableTag>
              <CheckableTag
                key='tag3'
                checked={editingItem.isTop}
              >
                {editingItem.isTop ? '置顶' : '未置顶'}
              </CheckableTag>
              </span>
            </Form.Item>
          </Col>
          )}
        </Row>
        <Row>
          <Col span={5} offset={3}>
            <Form.Item
                name="filePath"
                label="背景图"
                rules={[
                  {
                    required: !isDetail,
                    message: '必填',
                  },
                ]}
              >
                {isDetail ? (
                  <Image src={editingItem?.filePath} />
                ) : (
                  <UploadForm
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  maxSize={1}
                  accept=".bmp,.gif,.png,.jpeg,.jpg"
                />
                )}
              </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item
                name="filePath"
                label="分享图"
                rules={[
                  {
                    required: !isDetail,
                    message: '必填',
                  },
                ]}
              >
                {isDetail ? (
                  <Image src={editingItem?.filePath} />
                ) : (
                  <UploadForm
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  maxSize={1}
                  accept=".bmp,.gif,.png,.jpeg,.jpg"
                />
                )}
              </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item
                name="filePath"
                label="购物直播频道封面图"
                rules={[
                  {
                    required: !isDetail,
                    message: '必填',
                  },
                ]}
              >
                {isDetail ? (
                  <Image src={editingItem?.filePath} />
                ) : (
                  <UploadForm
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  maxSize={1}
                  accept=".bmp,.gif,.png,.jpeg,.jpg"
                />
                )}
              </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={10} offset={2}>
            <Form.Item 
              name="startTime" 
              label="开播时间"
              rules={[
                {
                  required: !isDetail,
                  message: '必填',
                },
              ]}>
              {isDetail ? (
                <span>{editingItem?.startTime || '--'}</span>
              ) : (
                <DatePicker allowClear showTime />
              )}
            </Form.Item>
            <Form.Item
              name="speakerName"
              label="主讲人(主播昵称)"
              rules={[
                {
                  required: !isDetail,
                  message: '必填',
                },
              ]}
            >
              {isDetail ? (
                <span>{editingItem?.name || '--'}</span>
              ) : (
                <Input placeholder="请输入" maxLength={35} />
              )}
            </Form.Item>
            <Form.Item
              name="orgName"
              label="主播微信号"
              rules={[
                {
                  required: !isDetail,
                  message: '必填',
                },
              ]}
            >
              {isDetail ? (
                <span>{editingItem?.name || '--'}</span>
              ) : (
                <Input placeholder="请输入" maxLength={35} />
              )}
            </Form.Item>
            <Form.Item
              name="orgName"
              label="创建者微信号"
              rules={[
                {
                  required: !isDetail,
                  message: '必填',
                },
              ]}
            >
              {isDetail ? (
                <span>{editingItem?.name || '--'}</span>
              ) : (
                <Input placeholder="请输入" maxLength={35} />
              )}
            </Form.Item>
            <Form.Item
              name="isSupportTry"
              label="官方收录"
              rules={[
                {
                  required: !isDetail,
                  message: '必填',
                },
              ]}
              initialValue={1}
            >
              {isDetail ? (
                <span>{editingItem?.name || '--'}</span>
              ) : (
                <Radio.Group
                  onChange={(e) => {
                    form.setFieldsValue({ tryTime: undefined });
                    setIsTry(e.target.value);
                  }}
                >
                  <Radio value={1}>开启</Radio>
                  <Radio value={0}>关闭</Radio>
                </Radio.Group>
              )}
            </Form.Item>
            <Form.Item 
              name="checkbox-group1" 
              label="拓展功能"
              >
              {isDetail ? (
                <span>{editingItem?.name || '--'}</span>
              ) : (
                <Checkbox.Group>
                  <Checkbox value="A">
                    回放
                  </Checkbox>
                  <Checkbox value="B">
                    客服
                  </Checkbox>
                </Checkbox.Group>
              )}
              {!isDetail && (<div className={'tooltip'}>
                直播开始后允许修改
              </div>)}
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item 
              name="endTime" 
              label="结束时间"
              rules={[
                {
                  required: !isDetail,
                  message: '必填',
                },
              ]}>
              {isDetail ? (
                <span>{editingItem?.endTime || '--'}</span>
              ) : (
                <DatePicker allowClear showTime />
              )}
            </Form.Item>
            <Form.Item
              name="typeNames"
              label="类型"
              rules={[
                {
                  required: !isDetail,
                  message: '必填',
                },
              ]}
            >
              {isDetail ? (
                <span>{editingItem?.typeNames || '--'}</span>
              ) : (
                <Select placeholder="请选择">
                  {appTypes.map((p) => (
                    <Select.Option key={'type' + p.id} value={p.id}>
                      {p.name}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
            <Form.Item
              name="orgName"
              label="主播副号微信号"
            >
              {isDetail ? (
                <span>{editingItem?.name || '--'}</span>
              ) : (
                <Input placeholder="请输入" maxLength={35} />
              )}
            </Form.Item>
            <Form.Item
              name="isTopApp"
              label="直播类型"
              initialValue={1}
              rules={[
                {
                  required: !isDetail,
                  message: '必填',
                },
              ]}
            >
              {isDetail ? (
                <span>{editingItem?.name || '--'}</span>
              ) : (
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
                  <Radio value={1}>手机直播</Radio>
                  <Radio value={0}>推流设备直播</Radio>
                </Radio.Group>
              )}
            </Form.Item>
            <Form.Item 
              name="checkbox-group1" 
              label="直播间功能">
                {isDetail ? (
                  <span>{editingItem?.name || '--'}</span>
                ) : (
                  <Checkbox.Group>
                    <Checkbox value="A">
                      点赞
                    </Checkbox>
                    <Checkbox value="B">
                      货架
                    </Checkbox>
                    <Checkbox value="C">
                      评论
                    </Checkbox>
                    <Checkbox value="D">
                      分享
                    </Checkbox>
                  </Checkbox.Group>
                )}
                {!isDetail && (<div className={'tooltip'}>
                  以上四个功能在开播后无法设置开启或关闭
                </div>)}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={18}>
            <Form.Item
              name="name"
              label="URL"
            >
              {isDetail ? (
                <span>{editingItem?.url || '--'}</span>
              ) : (
                <Input placeholder="请输入" maxLength={35} />
              )}
            </Form.Item>
          </Col>
        </Row>
        {isDetail && (
          <Row>
            <Col span={10} offset={2}>
              <Form.Item 
                name="start" 
                label="点击量">
                <span>{editingItem?.clickCount || '--'}</span>
              </Form.Item>
              <Form.Item 
                name="start" 
                label="上次上架时间">
                <span>{editingItem?.lineTime || '--'}</span>
              </Form.Item>
              <Form.Item 
                name="start" 
                label="创建时间">
                <span>{editingItem?.createTime || '--'}</span>
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item 
                name="start" 
                label="上次上架人">
                <span>{editingItem?.name || '--'}</span>
              </Form.Item>
              <Form.Item 
                name="start" 
                label="创建人">
                <span>{editingItem?.name || '--'}</span>
              </Form.Item>
            </Col>
          </Row>
        )}
      </Form>
      <div></div>
    </PageContainer>
  );
};
