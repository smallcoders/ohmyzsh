import React, { useState, useRef, useMemo, useEffect } from 'react';
import {
  Button,
  Input,
  Form,
  Select,
  Breadcrumb,
  Radio,
  DatePicker,
  Image,
  Space,
  Popconfirm,
  Dropdown,
  message,
} from 'antd';
import FormEdit from '@/components/FormEdit';
import UploadFormFile from '@/components/upload_form/upload-form-file';
// import UploadFormFile from '@/pages/page_creat_manage/edit/components/upload_form/upload-form-file'
import { useConfig } from '@/pages/page_creat_manage/edit/hooks/hooks';
import UploadFormAvatar from '@/components/upload_form/upload-form-avatar';
import { UploadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import UploadForm from '@/components/upload_form';
import moment from 'moment';
import { PageContainer } from '@ant-design/pro-layout';
import scopedClasses from '@/utils/scopedClasses';
import { routeName } from '../../../../../../config/routes';
import { history, Link, useAccess, Access, Prompt } from 'umi';
import './index.less';
import ServiceItem from '../components/service-item';
import {
  httpServiceAccountPictureTextSubmit,
  httpServiceAccountPictureSubmit,
  httpServiceAccountTextSubmit,
  httpServiceAccountVideoSubmit,
  httpServiceAccountAudioSubmit,
  httpArticlePictureTextSave,
  httpServiceAccountPictureSave,
  httpServiceAccountTextSave,
  httpServiceAccountVideoSave,
  httpServiceAccountAudioSave,
  httpServiceAccountArticleDetail,
} from '@/services/service-management';
const sc = scopedClasses('service-number-drafts-add');

type RouterParams = {
  appId?: string;
  type?: string;
  state?: string;
  id?: string;
  name?: string;
};
export default () => {
  // 内容信息form
  const [contentInfoForm] = Form.useForm();
  // 监听的标题 title
  const contentInfoFormTitle = Form.useWatch('title', contentInfoForm);
  // 监听的文本内容
  const contentInfoFormContent = Form.useWatch('content', contentInfoForm);
  // 监听的封面图
  const [imgUrl, setImgUrl] = useState<any>();
  const [imgUrlId, setImgUrlId] = useState<string>();
  // 监听视频 / 音频
  const attachmentUrl = Form.useWatch('attachmentId', contentInfoForm);
  const [showControls, setShowControls] = useState<boolean>(false);
  // 暂存 第一次暂存成功，保存暂存ID
  const [saveId, setSaveId] = useState<number>()

  useEffect(() => {
    console.log('监听视频/ 音频', attachmentUrl);
  }, [attachmentUrl]);
  // 监听的封面图
  // 发布信息form
  const [formPostMessage] = Form.useForm();
  // 字段监听Hooks
  const formPostMessageName = Form.useWatch('syncIndustrial', formPostMessage);

  const formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };
  const access = useAccess();
  const [loading, setLoading] = useState<boolean>(false);
  /**
   * 当前的新增还是编辑
   */
  const [activeTitle, setActiveTitle] = useState<any>('新增');

  // 根据路由获取参数
  const { type, state = 'tuwen', id, name } = history.location.query as RouterParams;

  const perpaer = async (id?: string) => {
    if (!id) return;
    try {
      const res = await httpServiceAccountArticleDetail(id);
      if (res?.code === 0) {
        const detail = res?.result;
        console.log('获取的编辑详情', detail);
        // 如果返回了裁切的图片
        if (detail && detail?.coverUrl) {
          setImgUrl(detail?.coverUrl)
          setImgUrlId(detail?.coverId)
        }
        // 如果是实时发布, 隐藏发布时间
        if (detail && detail?.realTimePublishing) {
          setTimeShow(false)
        }
        // 发布信息
        formPostMessage.setFieldsValue({
          // 发布方式
          realTimePublishing: detail?.realTimePublishing,
          // 发布时间
          publishTime: detail?.publishTime ? moment(detail?.publishTime) : undefined,
          // 是否同步到产业圈
          syncIndustrial: detail?.syncIndustrial,
        });
        // 内容信息
        contentInfoForm.setFieldsValue({
          ...detail,
          // 裁切的封面图要用Url地址
          coverId: detail?.coverUrl,
          // 图片
          attachmentIdList:
            detail?.attachmentList?.length > 0  &&
            detail?.attachmentList?.map((item: any) => {
              return {
                createTime: item.createTime,
                format: item.format,
                uid: item.id,
                name: item.name,
                path: item.path,
                thumbUrl: item.path,
              };
            }),
          // attachmentId 音频视频可以判断一下
          attachmentId: detail?.attachmentList?.length > 0 && detail?.attachmentList?.map((item: any) => {
            return {
              createTime: item?.createTime,
              format: item?.format,
              id: item?.id,
              name: item?.name,
              path: item?.path,
              uid: item.id,
              url: item?.path,
            };
          }),

        });
      } else {
        throw new Error('');
      }
    } catch (error) {
      message.error(`初始化失败: ${error}`);
    }
  };

  useEffect(() => {
    console.log('新增页获取的参数', type, state, id, name);
    if (type && type === 'edit' && id) {
      // 初始化
      perpaer(id);
    }
  }, []);

  enum stateEnum {
    PICTURE_TEXT = 'PICTURE_TEXT',
    PICTURE = 'PICTURE',
    TEXT = 'TEXT',
    VIDEO = 'VIDEO',
    AUDIO = 'AUDIO',
  }
  // 根据路由参数展示不同内容信息

  // 内容信息 - 封面图
  const coverOnChange = (value: any) => {
    setImgUrl(value);
  };
  // 裁切封面图ID
  const coverOnChangeId = (value: any) => {
    setImgUrlId(value)
  }

  // 内容信息 - 图文信息
  const Tuwen = (
    <div className={sc('container-left-top-content')}>
      <div className={sc('container-left-top-content-title')}>内容信息</div>
      <div className={sc('container-left-top-content-form')}>
        <Form {...formLayout} form={contentInfoForm} validateTrigger={['onBlur']}>
          <Form.Item label="标题" name="title" rules={[{ required: true, message: '必填' }]}>
            <Input maxLength={100} placeholder="请输入" allowClear />
          </Form.Item>
          <Form.Item label="作者" name="authorName">
            <Input maxLength={30} placeholder="请输入" allowClear />
          </Form.Item>
          <Form.Item label="封面图" name="coverId" rules={[{ required: true, message: '必填' }]}>
            {/* <UploadForm
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              accept=".png,.jpeg,.jpg"
              tooltip={<span className={'tooltip'}>图片格式仅支持JPG、PNG、JPEG</span>}
              setValue={(e) => coverOnChange(e)}
            /> */}
            <UploadFormAvatar
              tooltip={<span className={'tooltip'}>图片格式仅支持JPG、PNG、JPEG</span>}
              action={'/antelope-common/common/file/upload/record/withAuthCheck'}
              listType="picture-card"
              className="avatar-uploader"
              maxCount={1}
              accept=".png,.jpeg,.jpg"
              shape={'rect'}
              // shape={false}
              setValue={(e) => coverOnChange(e)}
              setValueId={(e) => coverOnChangeId(e)}
            />
          </Form.Item>
          <Form.Item label="内容" name="content" rules={[{ required: true, message: '请输入' }]}>
            <FormEdit width="100%" />
          </Form.Item>
        </Form>
      </div>
    </div>
  );
  // 内容信息 - 图片信息
  const TUPIAN = (
    <div className={sc('container-left-top-content')}>
      <div className={sc('container-left-top-content-title')}>内容信息</div>
      <div className={sc('container-left-top-content-form')}>
        <Form {...formLayout} form={contentInfoForm} validateTrigger={['onBlur']}>
          <Form.Item label="标题" name="title" rules={[{ required: true, message: '必填' }]}>
            <Input maxLength={100} placeholder="请输入" allowClear />
          </Form.Item>
          <Form.Item label="描述信息" name="content">
            <Input.TextArea
              placeholder="请输入"
              autoSize={{ minRows: 3, maxRows: 5 }}
              maxLength={300}
            />
          </Form.Item>
          <Form.Item label="封面图" name="coverId" rules={[{ required: true, message: '必填' }]}>
            {/* <UploadForm
              maxCount={1}
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              accept=".png,.jpeg,.jpg"
              tooltip={<span className={'tooltip'}>图片格式仅支持JPG、PNG、JPEG</span>}
              setValue={(e) => coverOnChange(e)}
            /> */}
            <UploadFormAvatar
              tooltip={<span className={'tooltip'}>图片格式仅支持JPG、PNG、JPEG</span>}
              action={'/antelope-common/common/file/upload/record/withAuthCheck'}
              listType="picture-card"
              className="avatar-uploader"
              maxCount={1}
              accept=".png,.jpeg,.jpg"
              shape={'rect'}
              // shape={false}
              setValue={(e) => coverOnChange(e)}
              setValueId={(e) => coverOnChangeId(e)}
            />
          </Form.Item>
          {/* 多张上传 */}
          <Form.Item
            label="图片"
            name="attachmentIdList"
            rules={[{ required: true, message: '必填' }]}
          >
            <UploadFormFile
              multiple
              showUploadList={true}
              listType="picture-card"
              className="avatar-uploader"
              accept=".png,.jpeg,.jpg"
              tooltip={
                <span className={'tooltip'}>图片格式仅支持JPG、PNG、JPEG, 且支持多张上传</span>
              }
            >
              + 上传
            </UploadFormFile>
            {/* <UploadForm
              multiple
              showUploadList={true}
              listType="picture-card"
              className="avatar-uploader"
              accept=".png,.jpeg,.jpg"
              tooltip={<span className={'tooltip'}>图片格式仅支持JPG、PNG、JPEG, 且支持多张上传</span>}
              beforeUpload={(file, files) => pictureBeforeUpload(file, files)}
            >
              + 上传
            </UploadForm> */}
          </Form.Item>
        </Form>
      </div>
    </div>
  );
  // 内容信息 - 文字信息
  const WENZI = (
    <div className={sc('container-left-top-content')}>
      <div className={sc('container-left-top-content-title')}>内容信息</div>
      <div className={sc('container-left-top-content-form')}>
        <Form {...formLayout} form={contentInfoForm} validateTrigger={['onBlur']}>
          <Form.Item label="文本内容" name="content" rules={[{ required: true, message: '必填' }]}>
            <Input.TextArea
              placeholder="请输入"
              autoSize={{ minRows: 3, maxRows: 5 }}
              maxLength={500}
            />
          </Form.Item>
        </Form>
      </div>
    </div>
  );
  // 内容信息 - 视频
  const SHIPIN = (
    <div className={sc('container-left-top-content')}>
      <div className={sc('container-left-top-content-title')}>内容信息</div>
      <div className={sc('container-left-top-content-form')}>
        <Form {...formLayout} form={contentInfoForm} validateTrigger={['onBlur']}>
          <Form.Item label="标题" name="title" rules={[{ required: true, message: '必填' }]}>
            <Input maxLength={100} placeholder="请输入" allowClear />
          </Form.Item>
          <Form.Item label="作者" name="authorName">
            <Input maxLength={30} placeholder="请输入" allowClear />
          </Form.Item>
          <Form.Item label="视频介绍" name="content">
            <Input.TextArea
              placeholder="请输入"
              autoSize={{ minRows: 3, maxRows: 5 }}
              maxLength={300}
            />
          </Form.Item>
          <Form.Item
            label="视频封面图"
            name="coverId"
            rules={[{ required: true, message: '必填' }]}
          >
            <UploadFormAvatar
              tooltip={<span className={'tooltip'}>图片格式仅支持JPG、PNG、JPEG</span>}
              action={'/antelope-common/common/file/upload/record/withAuthCheck'}
              listType="picture-card"
              className="avatar-uploader"
              maxCount={1}
              accept=".png,.jpeg,.jpg"
              shape={'rect'}
              // shape={false}
              setValue={(e) => coverOnChange(e)}
              setValueId={(e) => coverOnChangeId(e)}
            />
          </Form.Item>
          <Form.Item label="视频" name="attachmentId" rules={[{ required: true, message: '必填' }]}>
            <UploadFormFile
              multiple={false}
              accept=".mp4"
              maxCount={1}
              showUploadList
              maxSize={50}
              // 开启url的发回
              isSkip
              onChange={(value: any) => {
                // 如果需要同步到服务号，可以再这里setState
              }}
            >
              <Button icon={<UploadOutlined />}>上传视频</Button>
            </UploadFormFile>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
  // 内容信息 - 音频
  const YINPIN = (
    <div className={sc('container-left-top-content')}>
      <div className={sc('container-left-top-content-title')}>内容信息</div>
      <div className={sc('container-left-top-content-form')}>
        <Form {...formLayout} form={contentInfoForm} validateTrigger={['onBlur']}>
          <Form.Item label="标题" name="title" rules={[{ required: true, message: '必填' }]}>
            <Input maxLength={100} placeholder="请输入" allowClear />
          </Form.Item>
          <Form.Item label="作者" name="authorName">
            <Input maxLength={30} placeholder="请输入" allowClear />
          </Form.Item>
          <Form.Item label="音频介绍" name="content">
            <Input.TextArea
              placeholder="请输入"
              autoSize={{ minRows: 3, maxRows: 5 }}
              maxLength={300}
            />
          </Form.Item>
          <Form.Item label="音频" name="attachmentId" rules={[{ required: true, message: '必填' }]}>
            <UploadFormFile
              multiple={false}
              accept=".mp3,.wma,wav,amr,m4a"
              maxCount={1}
              showUploadList
              maxSize={200}
              // 开启url的发回
              isSkip
              onChange={(value: any) => {
                contentInfoForm.validateFields(['音频']);
                // 如果需要同步到服务号，可以再这里setState
              }}
            >
              <Button icon={<UploadOutlined />}>上传音频</Button>
            </UploadFormFile>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
  const ContentInfo = {
    [stateEnum.PICTURE_TEXT]: Tuwen,
    [stateEnum.PICTURE]: TUPIAN,
    [stateEnum.TEXT]: WENZI,
    [stateEnum.VIDEO]: SHIPIN,
    [stateEnum.AUDIO]: YINPIN,
  }[state];

  // 当前的内容信息的接口
  const contentInfoHttp = {
    [stateEnum.PICTURE_TEXT]: httpServiceAccountPictureTextSubmit,
    [stateEnum.PICTURE]: httpServiceAccountPictureSubmit,
    [stateEnum.TEXT]: httpServiceAccountTextSubmit,
    [stateEnum.VIDEO]: httpServiceAccountVideoSubmit,
    [stateEnum.AUDIO]: httpServiceAccountAudioSubmit,
  }[state];

  // 当前的内容信息暂存的接口
  const contentInfoHttpSave = {
    [stateEnum.PICTURE_TEXT]: httpArticlePictureTextSave,
    [stateEnum.PICTURE]: httpServiceAccountPictureSave,
    [stateEnum.TEXT]: httpServiceAccountTextSave,
    [stateEnum.VIDEO]: httpServiceAccountVideoSave,
    [stateEnum.AUDIO]: httpServiceAccountAudioSave,
  }[state];

  useEffect(() => {
    console.log('获取的参数', type, state);
    setActiveTitle(type === 'add' ? '新增' : '编辑');
    if (type === 'add') {
      console.log('是新增呀');
      formPostMessage.setFieldsValue({ realTimePublishing: false });
      formPostMessage.setFieldsValue({ syncIndustrial: true });
    }
  }, [type, state]);

  const onSubmit = async (statue: number) => {
    if (statue === 1) {
      // 发布
      // 需要来一个当前的内容信息表单, 看所有的是不是一个
      Promise.all([contentInfoForm.validateFields(), formPostMessage.validateFields()]).then(
        async ([contentInfoFormValues, formPostMessageValues]) => {
          const formData = { ...contentInfoFormValues, ...formPostMessageValues };
          console.log('搜集的form', formData);
          // 视频id
          const attachmentId = formData.attachmentId && formData.attachmentId[0].uid;
          console.log('attachmentId', attachmentId);
          try {
            const res = await contentInfoHttp({
              ...formData,
              // 新增需要添加id
              serviceAccountId: type === 'edit' ? undefined : id,
              // 编辑需要传id
              id: type === 'edit' ? id : undefined,
              // 裁切的封面图
              // coverId: Number(formData.coverId),
              coverId: imgUrlId,
              publishTime:
                formData.publishTime && dayjs(formData.publishTime).format('YYYY-MM-DD HH:mm'),
              // 图片信息 - 图片
              attachmentIdList:
                formData.attachmentIdList &&
                formData.attachmentIdList?.map((item: any) => item.uid),
              // 视频
              attachmentId: attachmentId,
            });
            console.log('添加返回的res', res);
            if (res.code === 0) {
              message.success('操作成功');
              setIsClosejumpTooltip(false);
              history.goBack();
            } else {
              message.error(`发布失败，原因:{${res?.message}}`);
            }
          } catch (error) {
            message.error(`发布失败，原因:{${error}}`);
          }
        },
      );
    } else {
      // 暂存
      const contentInfoFormValues = contentInfoForm.getFieldsValue();
      const formPostMessageValues = formPostMessage.getFieldsValue();
      const formData = { ...contentInfoFormValues, ...formPostMessageValues };
      console.log('搜集的form', formData);
      // 视频id
      const attachmentId = formData.attachmentId && formData.attachmentId[0].uid;
      console.log('attachmentId', attachmentId);
      try {
        const res = await contentInfoHttpSave({
          ...formData,
          // 新增需要添加id, 第二次新增 saveId不需要service
          serviceAccountId: type === 'edit' 
          ? undefined 
          : saveId 
            ? undefined
            : id,
          // 编辑需要传id
          id: type === 'edit' 
            ? id 
            : saveId 
            ? saveId
            : undefined,
          // 裁切的封面图
          // coverId: Number(formData.coverId),
          coverId: imgUrlId,
          publishTime:
            formData.publishTime && dayjs(formData.publishTime).format('YYYY-MM-DD HH:mm'),
          // 图片信息 - 图片
          attachmentIdList:
            formData.attachmentIdList && formData.attachmentIdList?.map((item: any) => item.uid),
          // 视频
          attachmentId: attachmentId,
        });
        console.log('暂存返回的res', res);
        if (res.code === 0) {
          message.success('操作成功');
          if (res?.result) {
            if ( typeof res?.result === 'number') {
              console.log('返回的result是数字')
              setSaveId(res?.result)
            }
          }
        } else {
          message.error(`暂存失败，原因:{${res?.message}}`);
        }
      } catch (error) {
        message.error(`暂存失败，原因:{${error}}`);
      }
    }
  };
  /**
   * 发布信息 1 实时发布 2 预约发布
   */
  const [isTry, setIsTry] = useState<boolean>(false);
  // 发布信息选了实时发布，隐藏发布时间
  const [timeShow, setTimeShow] = useState<boolean>(true);
  useEffect(() => {
    if (isTry) {
      setTimeShow(false);
      return;
    }
    if (!isTry) {
      setTimeShow(true);
    }
  }, [isTry]);
  /**
   * 发布信息 是否同步到产业圈 1 实时发布 0 预约发布
   */
  const [sync, setSync] = useState<boolean>(false);

  const listener = (e: any) => {
    e.preventDefault();
    e.returnValue = '离开当前页后，所编辑的数据将不可恢复';
  };

  useEffect(() => {
    window.addEventListener('beforeunload', listener);
    return () => {
      window.removeEventListener('beforeunload', listener);
    };
  }, []);

  const [isClosejumpTooltip, setIsClosejumpTooltip] = useState<boolean>(true);


  const goBack = () => {
    console.log('点击了返回')
    setIsClosejumpTooltip(false) 
    history.goBack()
  }
  return (
    <PageContainer
      loading={loading}
      header={{
        title: activeTitle,
        breadcrumb: (
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to="/baseline/baseline-service-number">服务号管理</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{activeTitle}</Breadcrumb.Item>
          </Breadcrumb>
        ),
      }}
      footer={[
        // access后端根据
        // <Access accessible={access['PA_BLM_NRGL']}>
        <React.Fragment>
          {!isTry && (
            <Popconfirm
              title={
                <div>
                  <div>提示</div>
                  <div>若设定预约发布，则会在设定的时间进行发布</div>
                </div>
              }
              okText="发布"
              cancelText="取消"
              onConfirm={() => onSubmit(1)}
            >
              {/* <Button type="primary" htmlType="submit"  onClick={() => onSubmit(1)}> */}
              <Button type="primary" htmlType="submit">
                发布
              </Button>
            </Popconfirm>
          )}
          {isTry && (
            <Button type="primary" htmlType="submit" onClick={() => onSubmit(1)}>
              发布
            </Button>
          )}
        </React.Fragment>,
        // </Access>,
        // <Access accessible={access['PA_BLM_NRGL']}>
        <React.Fragment>
          <Button onClick={() => onSubmit(2)}>暂存</Button>
        </React.Fragment>,
        // </Access>,
        <Button
          onClick={() => goBack()}
        >
          返回
        </Button>,
      ]}
    >
      <Prompt
        when={isClosejumpTooltip}
        message={'离开此页面，将不会保存当前编辑的内容，确认离开吗？'}
      />
      <div className={sc('container')}>
        <div className={sc('container-left')}>
          <div className={sc('container-left-top')}>{ContentInfo}</div>
          <div className={sc('container-left-bottom')}>
            <div className={sc('container-left-bottom-title')}>发布信息</div>
            <div className={sc('container-left-bottom-form')}>
              <Form form={formPostMessage} {...formLayout} validateTrigger={['onBlur']}>
                <Form.Item
                  label="发布方式"
                  name="realTimePublishing"
                  rules={[{ required: true, message: '必填' }]}
                >
                  <Radio.Group onChange={(e) => setIsTry(e.target.value)}>
                    <Radio value={true}>实时发布</Radio>
                    <Radio value={false}>预约发布</Radio>
                  </Radio.Group>
                </Form.Item>
                {/* <Form.Item
                  label="发布服务号"
                  name="serviceAccountId"
                  rules={[{ required: true, message: '必填' }]}
                >
                  <Select placeholder="请选择">
                  {[
                    {
                      id: 1,
                      name: '选项1'
                    },
                    {
                      id: 2,
                      name: '选项2'
                    },
                    {
                      id: 3,
                      name: '选项3'
                    }
                  ].map((p) => (
                    <Select.Option key={'type' + p.id} value={p.id}>
                      {p.name}
                    </Select.Option>
                  ))}
                  </Select>
                </Form.Item> */}
                {timeShow && (
                  <Form.Item
                    label="发布时间"
                    name="publishTime"
                    rules={[{ required: true, message: '必填' }]}
                  >
                    <DatePicker
                      showTime={{ format: 'HH:mm' }}
                      style={{ width: '100%' }}
                      disabledDate={(current) => {
                        const maxDate = moment().add(15, 'days').startOf('day');
                        return current && (current < moment().startOf('day') || current > maxDate);
                      }}
                    />
                  </Form.Item>
                )}
                <Form.Item label="是否同步到产业圈" name="syncIndustrial">
                  <Radio.Group onChange={(e) => setSync(e.target.value)}>
                    <Radio value={true}>是</Radio>
                    <Radio value={false}>否</Radio>
                  </Radio.Group>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
        <div className={sc('container-right')}>
          <div className={sc('container-right-serve')}>
            <div className={sc('container-right-serve-title')}>服务号预览</div>
            <div className={sc('container-right-serve-content')}>
              <div className={sc('container-right-serve-content-header')}>
                {/* <img className={sc('container-right-serve-content-header-img')} src="" alt="" /> */}
                <div className={sc('container-right-serve-content-header-name')}>
                  {/* 服务号的名称再确定一下 */}
                  {name || '服务号名称'}
                </div>
              </div>
              {
                // 文本没有标题
                !['TEXT'].includes(state) && (
                  <div className={sc('container-right-serve-content-text')}>
                    标题：
                    {contentInfoFormTitle ||
                      '标题'}
                  </div>
                )
              }
              {
                // 如果是图片， 图文， 视频， 视频 展示封面图
                ['PICTURE_TEXT', 'PICTURE', 'VIDEO'].includes(state) && (
                  <div className={sc('container-right-serve-content-img')}>
                    <img className={sc('container-right-serve-content-img-url')} src={imgUrl} alt="" />
                  </div>
                )
              }
              {
                // 如果是视频展示
                ['VIDEO'].includes(state) && (
                  <div className={sc('container-right-serve-content-video')}>
                    {attachmentUrl && attachmentUrl?.length > 0 && (
                      <video
                        src={attachmentUrl[0].url}
                        preload="true"
                        width="100%"
                        height="100%"
                        muted
                        loop={false}
                        controls={showControls}
                        onMouseEnter={() => {
                          setShowControls(true);
                        }}
                        onMouseLeave={() => {
                          setShowControls(false);
                        }}
                        // 隐藏下载按钮
                        controlsList="nodownload"
                        // 此属性在android设备播放视频时,导致自动全屏播放
                        // x5-video-player-type="h5-page"
                        /**
                         * ios系统
                         * 内联播放
                         */
                        playsInline
                        /* eslint-disable-next-line react/no-unknown-property */
                        webkit-playsinline="true"
                        /**
                         * 同层h5播放器
                         * 网页内部同层播放
                         * 视频上方显示html元素
                         *  */
                        /* eslint-disable-next-line react/no-unknown-property */
                        x5-playsinline="true"
                      ></video>
                    )}
                  </div>
                )
              }
              {
                // 如果是文字展示 文本内容
                ['TEXT'].includes(state) && (
                  <div className={sc('container-right-serve-content-content')}>
                    { contentInfoFormContent && (
                      <div>
                        {contentInfoFormContent || '文本内容...'}
                      </div>
                    )}
                  </div>
                )
              }
            </div>
          </div>
          {sync && (
            <div className={sc('container-right-industry')}>
              <div className={sc('container-right-industry-title')}>产业圈预览</div>
              <div className={sc('container-right-industry-content')}>
                <div className={sc('container-right-industry-content-left')}>
                  <div className={sc('container-right-industry-content-left-name')}>
                    标题显示标题显示
                  </div>
                  <div className={sc('container-right-industry-content-left-bottom')}>
                    <div className={sc('container-right-industry-content-left-bottom-name')}>
                      服务号名称
                    </div>
                    <div className={sc('container-right-industry-content-left-bottom-time')}>
                      发布时间
                    </div>
                  </div>
                </div>
                <div className={sc('container-right-industry-content-right')}>
                  <img className={sc('container-right-industry-content-right-img')} src="" alt="" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
};
