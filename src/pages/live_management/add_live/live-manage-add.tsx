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
const { RangePicker } = DatePicker;
import moment from 'moment';
import { PageContainer } from '@ant-design/pro-layout';
import './live-manage-add.less';
import scopedClasses from '@/utils/scopedClasses';
import { useEffect, useState } from 'react';
import {
  getVideoDetail,
  addLive,
  updateLive,
  getLiveTypesPage
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
   * 直播类型
   */
  const [appTypes, setAppTypes] = useState<{ id: string; name: string }[]>([]);
  /**
   * 正在编辑的一行记录
   */
  const [editingItem, setEditingItem] = useState<AppResource.Content>({});

  // 编辑直播中/已结束状态的直播,只能编辑字段“官方收录、拓展功能”
  const [disabledFlag, setDisabledFlag] = useState<boolean>(false);

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
  const [isClosejumpTooltip, setIsClosejumpTooltip] = useState<boolean>(false);
  /**
   * 是否在编辑
   */
  const isEditing = Boolean(editingItem.id && !isDetail);
  console.log(isEditing, 'isEditing');

  //判断初始的是否尖刀应用并且是否正在修改的开关
  const [isBeginTopAndEditing, setIsBeginTopAndEditing] = useState<boolean>(false);

  const [form] = Form.useForm();

  const [formParams, setFormParams] = useState<object>({});

  const stateObj = {
    0: '未开始',
    1: '直播中',
    2: '已结束'
  };

  const options = [
    { label: '回放', value: 'replay' },
    { label: '客服', value: 'kf' }
  ];

  const options2 = [
    { label: '点赞', value: 'like' },
    { label: '货架', value: 'goods' },
    { label: '评论', value: 'comment' },
    { label: '分享', value: 'share' }
  ];

  // 新增直播时，直播时间选择不能选择今日今时之前的时间
  const range = (start, end) => {
    const result = [];
  
    for (let i = start; i < end; i++) {
      result.push(i);
    }
  
    return result;
  };
  const disabledDate = (current) => {
    // Can not select days before today
    return current < moment().endOf('day');
  };
  const disabledRangeTime = (_, type) => {
    if (type === 'start') {
      return {
        disabledHours: () => range(0, 60).splice(4, 20),
        disabledMinutes: () => range(30, 60),
        disabledSeconds: () => [55, 56],
      };
    }
  
    return {
      disabledHours: () => range(0, 60).splice(20, 4),
      disabledMinutes: () => range(0, 31),
      disabledSeconds: () => [55, 56],
    };
  };

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
      const prepareResultArray = await Promise.all([getLiveTypesPage({
        pageIndex: 1,
        pageSize: 100,
        status: 1
      })]);
      setAppTypes(prepareResultArray[0].result || []);

      const { id, isDetail } = history.location.query as { id: string | undefined, isDetail: string | undefined };

      if (id) {
        // 获取详情 塞入表单
        const detailRs = await getVideoDetail(id);
        let editItem = { ...detailRs.result };
        editItem.typeIds = editItem.typeIds?.split(',').map(Number);//返回的类型为字符串，需转为数组
        console.log(editItem, '---editItem')
        if (detailRs.code === 0) {
          editItem.isSkip = detailRs.result.url ? 1 : 0;
          setIsSkip(editItem.isSkip);
          // setIsBeginTopAndEditing(Boolean(editItem.isTopApp));
          console.log(editItem, 'res---editItem');
          let extended = [];//扩展功能数据获取
          if(!editItem.closeReplay) {
            extended.push('replay');
          }
          if(!editItem.closeKf) {
            extended.push('kf');
          }
          let liveFunctions = [];//直播间功能数据获取
          if(!editItem.closeLike) {
            liveFunctions.push('like');
          }
          if(!editItem.closeGoods) {
            liveFunctions.push('goods');
          }
          if(!editItem.closeComment) {
            liveFunctions.push('comment');
          }
          if(!editItem.closeShare) {
            liveFunctions.push('share');
          }
          setEditingItem({...editItem, liveFunctions, extended, time: [moment(editItem.startTime), moment(editItem.endTime)]});
          // 直播中/已结束状态的直播,只能编辑字段“官方收录、拓展功能”
          if(editItem.videoStatus == 1 || editItem.videoStatus == 2) {
            setDisabledFlag(true);
          }
        } else {
          message.error(`获取详情失败，原因:${detailRs.message}`);
        }
      }
      if(isDetail == '1') {
        setIsDetail(true);
        setIsClosejumpTooltip(false);
      }else {
        setIsClosejumpTooltip(true);
      }
    } catch (error) {
      console.log('error', error);
      message.error('获取初始数据失败');
    }
  };

  useEffect(() => {
    prepare();
  }, []);


  /**
   * 新增/编辑
   */
  const addOrUpdate = (lineStatus: boolean) => {
    form
      .validateFields()
      .then(async (value: AppResource.Detail) => {
        const tooltipMessage = editingItem.id ? '编辑' : '新增';
        console.log(value, '<---value');
        const hide = message.loading(`正在${tooltipMessage}`);
        setAddOrUpdateLoading(true);
        // // 编辑
        let addorUpdateRes = {};
        if(editingItem.id) {
          addorUpdateRes = await updateLive({
            ...value,
            startTime: moment(value.time[0]).format('YYYY-MM-DD HH:mm:ss'),
            endTime: moment(value.time[1]).format('YYYY-MM-DD HH:mm:ss'),
            closeReplay: value.extended?.indexOf('replay') > -1 ? 0 : 1,
            closeKf: value.extended?.indexOf('kf') > -1 ? 0 : 1,
            closeLike: value.liveFunctions?.indexOf('like') > -1 ? 0 : 1,
            closeGoods: value.liveFunctions?.indexOf('goods') > -1 ? 0 : 1,
            closeComment: value.liveFunctions?.indexOf('comment') > -1 ? 0 : 1,
            closeShare: value.liveFunctions?.indexOf('share') > -1 ? 0 : 1,
            id: editingItem.id
          });
          hide()
        }else {
          addorUpdateRes = await addLive({
            ...value,
            startTime: moment(value.time[0]).format('YYYY-MM-DD HH:mm:ss'),
            endTime: moment(value.time[1]).format('YYYY-MM-DD HH:mm:ss'),
            lineStatus: lineStatus,
            closeReplay: value.extended?.indexOf('replay') > -1 ? 0 : 1,
            closeKf: value.extended?.indexOf('kf') > -1 ? 0 : 1,
            closeLike: value.liveFunctions?.indexOf('like') > -1 ? 0 : 1,
            closeGoods: value.liveFunctions?.indexOf('goods') > -1 ? 0 : 1,
            closeComment: value.liveFunctions?.indexOf('comment') > -1 ? 0 : 1,
            closeShare: value.liveFunctions?.indexOf('share') > -1 ? 0 : 1
          });
          hide();
        }
        if (addorUpdateRes.code === 0) {
          message.success(`${tooltipMessage}成功`);
          setIsClosejumpTooltip(false);
          setAddOrUpdateLoading(false);
          history.push(routeName.ANTELOPE_LIVE_MANAGEMENT);
        } else {
          message.error(`${tooltipMessage}失败，原因:${addorUpdateRes.message}`);
          setAddOrUpdateLoading(false);
        } 
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

  return (
    <PageContainer
      className={sc('container')}
      header={{
        title: isEditing ? `编辑直播` : isDetail ? '直播详情' : '新增直播',
        breadcrumb: (
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to="/live-management/live-types-maintain">直播管理 </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to="/live-management/antelope-live-management">羚羊直播管理 </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              {isEditing ? `编辑直播` : isDetail ? '直播详情' : '新增直播'}
            </Breadcrumb.Item>
          </Breadcrumb>
        ),

        extra: (
          <div className="operate-btn">
            {!isDetail && (
              <Button key="cancel" loading={addOrUpdateLoading} onClick={() => {history.push(routeName.ANTELOPE_LIVE_MANAGEMENT)}}>
                取消
              </Button>
            )}
            {!isDetail && !isEditing && (
              <Button key="save" loading={addOrUpdateLoading} onClick={() => {addOrUpdate(true)}}>
                保存并上架
              </Button>
            )}
            {!isDetail && (
              <Button type="primary" key="save" loading={addOrUpdateLoading} onClick={() => {addOrUpdate(false)}}>
                保存
              </Button>
            )}
            {isDetail && (
              <Button key="goback" loading={addOrUpdateLoading} onClick={() => {
                history.push(routeName.ANTELOPE_LIVE_MANAGEMENT)
              }}>
                返回
              </Button>
            )}
          </div>
        ),
      }}
    >
      <Prompt
        when={isClosejumpTooltip && !isDetail}
        message={'离开当前页后，所编辑的数据将不可恢复'}
      />
      <Form className={sc('container-form')} {...formLayout} form={form} labelWrap
        initialValues={{liveFunctions: ['like', 'goods', 'comment', 'share']}}>
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
                {
                  validator(rule, value) {
                    if(value.length<3){
                      return Promise.reject('最短3个汉字')
                    }
                    if(value.length>17){
                      return Promise.reject('最长17个汉字')
                    }
                    if(!value||value.length===0){
                      return Promise.reject('必填')
                    }else {
                      return Promise.resolve()
                    }
                  },
                },
              ]}
            > 
              {isDetail ? (
                <span>{editingItem?.title || '--'}</span>
              ) : (
                <Input placeholder="请输入" maxLength={35} disabled={disabledFlag} />
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
                <Tag>
                  {Object.prototype.hasOwnProperty.call(stateObj, editingItem.videoStatus) ? stateObj[editingItem.videoStatus] : '--'}
                </Tag>
                <Tag>{editingItem.lineStatus ? '线上' : '线下'}</Tag>
                <Tag>{editingItem.isTop ? '置顶' : '未置顶'}</Tag>
                </span>
              </Form.Item>
            </Col>
          )}
        </Row>
        <Row>
          <Col span={6} offset={3}>
            <Form.Item
                name="coverImageId"
                label="直播卡片封面"
                // extra={`${!isDetail ? '图片建议大小为 800像素 * 800像素。图片大小不超过 300KB。图片内容遵循平台规范后更容易被推荐。' : ''}`}
                rules={[
                  {
                    required: !isDetail,
                    message: '必填',
                  },
                ]}
              >
                {isDetail ? (
                  <Image src={editingItem?.shareImagePath} width={200} />
                ) : (
                  <UploadForm
                  listType="picture-card"
                  disabled={disabledFlag}
                  className="avatar-uploader"
                  showUploadList={false}
                  maxSize={0.3}
                  tooltip={
                    <span className={'tooltip'}>仅支持JPG、PNG、JPEG,建议比例16*9，大小在0.3M以下</span>
                  }
                  accept=".bmp,.gif,.png,.jpeg,.jpg"
                />
                )}
              </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
                name="shareImageId"
                label="分享卡片封面"
                // extra={`${!isDetail ? '用户在微信对话框内分享的直播间将以分享卡片的形式呈现。建议尺寸：800像素 * 640像素，图片大小不得超过1M' : ''}`}
                rules={[
                  {
                    required: !isDetail,
                    message: '必填',
                  },
                ]}
              >
                {isDetail ? (
                  <Image src={editingItem?.backgroundImagePath} width={200} />
                ) : (
                  <UploadForm
                  listType="picture-card"
                  disabled={disabledFlag}
                  className="avatar-uploader"
                  showUploadList={false}
                  tooltip={
                    <span className={'tooltip'}>仅支持JPG、PNG、JPEG,建议尺寸800*640，大小在1M以下</span>
                  }
                  maxSize={1}
                  accept=".bmp,.gif,.png,.jpeg,.jpg"
                />
                )}
              </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
                name="backgroundImageId"
                label="直播间背景墙"
                // extra={`${!isDetail ? '直播间背景墙是每个直播间的默认背景。建议尺寸：600像素 * 1300像素，图片大小不得超过 3M。' : ''}`}
                rules={[
                  {
                    required: !isDetail,
                    message: '必填',
                  },
                ]}
              >
                {isDetail ? (
                  <Image src={editingItem?.coverImagePath} width={200} />
                ) : (
                  <UploadForm
                  listType="picture-card"
                  disabled={disabledFlag}
                  className="avatar-uploader"
                  showUploadList={false}
                  maxSize={3}
                  tooltip={
                    <span className={'tooltip'}>仅支持JPG、PNG、JPEG,建议尺寸600*1300，大小在3M以下</span>
                  }
                  accept=".bmp,.gif,.png,.jpeg,.jpg"
                />
                )}
              </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={18}>
            <Form.Item 
              name="time" 
              label="直播时间"
              rules={[
                {
                  required: !isDetail,
                  message: '必填',
                },
                {
                  validator(rule, value) {
                    if(!disabledFlag) {
                      const current = (new Date()).getTime();
                      const start = (new Date(value[0])).getTime();
                      const end = (new Date(value[1])).getTime();
                      if(start - current < 600000) {
                        return Promise.reject('开播时间需要在当前时间的10分钟后')
                      }
                      if(start - current > 6*30*24*60*60*1000) {
                        return Promise.reject('开始时间不能在6个月后')
                      }
                      if(end - start > 24*60*60*1000) {
                        return Promise.reject('开播时间和结束时间间隔不得超过24小时')
                      }
                      if(end - start < 30*60*1000) {
                        return Promise.reject('开播时间和结束时间间隔不得短于30分钟')
                      }
                      return Promise.resolve();
                    }else {
                      return Promise.resolve();
                    }
                  },
                },
              ]}>
              {isDetail ? (
                <span>开始：{editingItem?.startTime || '--'}<br></br> 结束：{editingItem?.endTime || '--'}</span>
              ) : (
                <RangePicker disabled={disabledFlag}
                  allowClear 
                  showTime
                />
              )}
            </Form.Item>
            </Col>
        </Row>
        <Row>
          <Col span={10} offset={2}>
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
                <span>{editingItem?.speakerName || '--'}</span>
              ) : (
                <Input placeholder="请输入" maxLength={15} disabled={disabledFlag} />
              )}
            </Form.Item>
            <Form.Item
              name="anchorWechat"
              label="主播微信号"
              rules={[
                {
                  required: !isDetail,
                  message: '必填',
                },
              ]}
            >
              {isDetail ? (
                <span>{editingItem?.anchorWechat || '--'}</span>
              ) : (
                <Input placeholder="请输入" maxLength={35} disabled={disabledFlag} />
              )}
            </Form.Item>
            <Form.Item
              name="createrWechat"
              label="创建者微信号"
            >
              {isDetail ? (
                <span>{editingItem?.createrWechat || '--'}</span>
              ) : (
                <Input placeholder="请输入" maxLength={35} disabled={disabledFlag} />
              )}
            </Form.Item>
            <Form.Item
              name="isFeedsPublic"
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
                <span>{editingItem?.isFeedsPublic ? '开启' : '关闭'}</span>
              ) : (
                <Radio.Group>
                  <Radio value={1}>开启</Radio>
                  <Radio value={0}>关闭</Radio>
                </Radio.Group>
              )}
            </Form.Item>
            <Form.Item 
              name="extended"
              label="拓展功能"
              extra={`${!isDetail ? '直播开始后允许修改' : ''}`}
              >
              {isDetail ? (
                <span>{!editingItem.closeReplay && ('回放')} {!editingItem.closeKf && ('客服')}</span>
              ) : (
                <Checkbox.Group options={options} />
              )}
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item
              name="typeIds"
              label="类型"
              rules={[
                {
                  required: !isDetail,
                  message: '必填',
                },
                {
                  validator(rule, value) {
                    if(value.length>3){
                      return Promise.reject('最多选3个')
                    }
                    if(!value||value.length===0){
                      return Promise.reject('必填')
                    }else {
                      return Promise.resolve()
                    }
                  },
                },
              ]}
            >
              {isDetail ? (
                <span>{editingItem?.typeNames || '--'}</span>
              ) : (
                <Select placeholder="请选择" mode="multiple" disabled={disabledFlag}>
                  {appTypes.map((p) => (
                    <Select.Option key={'type' + p.id} value={p.id}>
                      {p.name}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
            <Form.Item
              name="subAnchorWechat"
              label="主播副号微信号"
            >
              {isDetail ? (
                <span>{editingItem?.subAnchorWechat || '--'}</span>
              ) : (
                <Input placeholder="请输入" maxLength={35} disabled={disabledFlag}/>
              )}
            </Form.Item>
            {/* 直播状态为未开始时，编辑直播不能编辑直播类型 */}
            <Form.Item
              name="liveType"
              label="直播类型"
              initialValue={0}
              rules={[
                {
                  required: !isDetail,
                  message: '必填',
                },
              ]}
            >
              {isDetail ? (
                <span>{editingItem.liveType ? '推流设备直播' : '手机直播'}</span>
              ) : (
                <Radio.Group disabled={disabledFlag || editingItem.videoStatus == 0}>
                  <Radio value={0}>手机直播</Radio>
                  <Radio value={1}>推流设备直播</Radio>
                </Radio.Group>
              )}
            </Form.Item>
            <Form.Item 
              name="liveFunctions" 
              label="直播间功能"
              extra={`${!isDetail ? '以上四个功能在开播后无法设置开启或关闭' : ''}`}
            >
                {isDetail ? (
                  <span>{!editingItem.closeLike && ('点赞')} {!editingItem.closeGoods && ('货架')} {!editingItem.closeComment && ('评论')} {!editingItem.closeShare && ('分享')}</span>
                ) : (
                  <Checkbox.Group options={options2} disabled={disabledFlag}/>
                )}
            </Form.Item>
          </Col>
        </Row>
        {/* <Row>
          <Col span={18}>
            <Form.Item
              name="url"
              label="URL"
              rules={[
                {
                  validator(rule, value) {
                    let r = /^(((ht|f)tps?):\/\/)?([^!@#$%^&*?.\s-]([^!@#$%^&*?.\s]{0,63}[^!@#$%^&*?.\s])?\.)+[a-z]{2,6}\/?/.test(value);
                    if(!value || (value && value.length == 0)) {
                      return Promise.resolve()
                    }else {
                      if(!r){
                        return Promise.reject('请输入正确的网址')
                      }else {
                        return Promise.resolve()
                      }
                    }
                  },
                },
              ]}
            >
              {isDetail ? (
                <span>{editingItem?.url || '--'}</span>
              ) : (
                <Input placeholder="请输入" maxLength={35} />
              )}
            </Form.Item>
          </Col>
        </Row> */}
        {isDetail && (
          <Row>
            <Col span={10} offset={2}>
              <Form.Item 
                name="start" 
                label="点击量">
                <span>{editingItem?.clickCount}</span>
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
                <span>{editingItem?.lineAccountName || '--'}</span>
              </Form.Item>
              <Form.Item 
                name="start" 
                label="创建人">
                <span>{editingItem?.createAccountName || '--'}</span>
              </Form.Item>
            </Col>
          </Row>
        )}
      </Form>
      <div></div>
    </PageContainer>
  );
};
