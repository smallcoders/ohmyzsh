import { Button, message, Avatar, Space, Popconfirm, Form, Input, Modal, Select, Breadcrumb } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { history, Access, useAccess, Prompt, Link } from 'umi';
import './index.less';
import scopedClasses from '@/utils/scopedClasses';
import { UserOutlined } from '@ant-design/icons';
import { routeName } from '../../../../../config/routes';
import debounce from 'lodash/debounce';
import UploadForm from '@/components/upload_form';
import { httpAddSplash, httpMngDetail } from '@/services/home-screen-ad';
import { auditImgs } from '@/services/baseline';
import UploaImageV2 from '@/components/upload_form/upload-image-v2';
import { ExclamationCircleOutlined, UploadOutlined } from '@ant-design/icons';

const sc = scopedClasses('home-screen-ad-add');

type RouterParams = {
  type?: string;
  id?: string;
};
const { confirm } = Modal;
export default () => {
  const access = useAccess();
  /**
   * 当前的新增还是编辑
   */
  const { type, id } = history.location.query as RouterParams;
  const [activeTitle, setActiveTitle] = useState<string>('新增');

  // 暂存ID
  const [saveId, setSaveId] = useState<number>()

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
  const [loading, setLoading] = useState<boolean>(false);
  // 返回 模态框的状态
  const [visible, setVisible] = useState<boolean>(false);
  const formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 15 },
  };
  // 内容信息form
  const [contentInfoForm] = Form.useForm();
  // 基础信息的改变
  const [contentInfoFormChange, setContentInfoFormChange] = useState<boolean>(false);
  // 请求数据中
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const onSubmitDebounce = debounce((state, isPrompt?: boolean) => {
    onSubmit(state, isPrompt)
  },1000)
  const onSubmit = async (status: number, isPrompt?: boolean) => {
    if (status === 1) {
      await contentInfoForm.validateFields();
      const {advertiseName, imgs, countdown, siteLink, displayFrequency} = contentInfoForm.getFieldsValue();
      const params: any = {
        status,
        advertiseName,
        imgs: imgs 
        ? imgs.map((item: any) => {
          const image = new Image();
          if (imgs) {
            image.src = item.url;
          }
          return {
            path: item.url, 
            id: item.resData?.id || item.uid,
            width: image.width,
            high: image.height,
          }
        })
        : undefined,
        countdown,
        siteLink,
        displayFrequency,
        advertiseType: 'SPLASH_ADS',
        id: type === 'add' 
        ? saveId ? saveId : undefined
        : id
      }
      Modal.confirm({
        title: '提示',
        content: '确定上架当前内容？',
        okText: '上架',
        onOk: () => {
          auditImgs({
            ossUrls: params.imgs.map((item: any) => {return item.path})
          }).then((result) => {
            if (result.code === 0){
              httpAddSplash(params).then((res: any) => {
                if (res.code === 0){
                  setContentInfoFormChange(false)
                  message.success('上架成功')
                  // history.goBack()
                  history.push(`${routeName.BASELINE_OPERATIONS_MANAGEMENT_HOME_SCREEN_AD}`)
                } else {
                  message.error(res.message)
                }
              })
            } else {
              Modal.confirm({
                title: '风险提示',
                content: result.message,
                okText: '继续上架',
                onOk: () => {
                  httpAddSplash(params).then((res: any) => {
                    if (res.code === 0){
                      setContentInfoFormChange(false)
                      message.success('上架成功')
                      history.push(`${routeName.BASELINE_OPERATIONS_MANAGEMENT_HOME_SCREEN_AD}`)
                    } else {
                      message.error(res.message)
                    }
                  })
                }
              })
            }
          })
        },
      })
    } else {
      const {advertiseName, imgs, countdown, siteLink, displayFrequency} = contentInfoForm.getFieldsValue();
      const params: any = {
        status,
        advertiseName,
        imgs: imgs 
        ? imgs.map((item: any) => {
          const image = new Image();
          if (imgs) {
            image.src = item.url;
          }
          return {
            path: item.url, 
            id: item.resData?.id || item.uid,
            width: image.width,
            high: image.height,
          }
        })
        : undefined,
        countdown,
        siteLink,
        displayFrequency,
        advertiseType: 'SPLASH_ADS',
        id: type === 'add' 
        ? saveId ? saveId : undefined
        : id
      }
      httpAddSplash(params).then((res: any) => {
        if (res.code === 0){
          setSaveId(res?.result)
          setContentInfoFormChange(false)
          message.success('暂存成功')
          history.push(`${routeName.BASELINE_OPERATIONS_MANAGEMENT_HOME_SCREEN_AD}`)
        } else {
          message.error(res.message)
        }
      })
    }
  }

  const perpaer = async (id: any) => {
    try {
      const res = await httpMngDetail(id)
      if (res?.code === 0) {
        const detail = res?.result;

        contentInfoForm.setFieldsValue({
          ...detail,
          // 需要再根据返回值调整
          imgs: detail.imgRelations?.length ? detail.imgRelations?.map((item: any) => {
            return {
              uid: `${item.fileId}`,
              name: item.ossUrl,
              status: 'done',
              url: item.ossUrl
            }
          }) : []
        })
      } else {
        message.error(`获取详情失败: ${res?.message}`)
      }
    } catch (error) {
      message.error(`获取详情失败: ${error}`)
    }
  }
  useEffect(() => {
    console.log('初始化默认值')
    setActiveTitle(type === 'add' ? '新增' : '编辑');
    // 有编辑 和新增
    if (type === 'add') {
      // 初始化表单默认项
      contentInfoForm.setFieldsValue({ countdown: 3 })
      contentInfoForm.setFieldsValue({ displayFrequency: 'EVERY_TIME' })
    }
    if (id) {
      perpaer(id)
    }
  },[])


  return (
    <PageContainer
      className={sc('container')}
      loading={loading}
      header={{
        title: activeTitle,
        breadcrumb: (
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to={routeName.BASELINE_OPERATIONS_MANAGEMENT}>基线运营位管理</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to={routeName.BASELINE_OPERATIONS_MANAGEMENT_HOME_SCREEN_AD}>开屏广告</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{activeTitle}</Breadcrumb.Item>
          </Breadcrumb>
        ),
      }}
      footer={[
        // access后端根据
        <Access accessible={access['PU_BLAM_KPGG']}>
          <React.Fragment>
              <Button onClick={() => onSubmitDebounce(1)} disabled={isExporting} type="primary" htmlType="submit">
                立即上架
              </Button>
          </React.Fragment>
        </Access>,
        <Access accessible={access['PU_BLAM_KPGG']}>
          <React.Fragment>
            <Button disabled={isExporting} onClick={() => onSubmitDebounce(0)}>暂存</Button>
          </React.Fragment>
        </Access>,
        <Button onClick={() => {
            history.push(`${routeName.BASELINE_OPERATIONS_MANAGEMENT_HOME_SCREEN_AD}`)
        }}>返回</Button>,
      ]}
    >
      <Prompt
        when={contentInfoFormChange}
        message={(location: any) => {
          Modal.confirm({
            title: '要在离开之前对填写的信息进行保存吗?',
            icon: <ExclamationCircleOutlined />,
            cancelText: '放弃修改并离开',
            okText: '暂存并离开',
            onCancel() {
              setContentInfoFormChange(false)
              setTimeout(() => {
                history.push(location.pathname);
              }, 100);
            },
            onOk() {
              onSubmitDebounce(0)
            },
          });
          return false;
        }}
      />
      <div className={sc('container-info')}>
        <div className={sc('container-info-header')}>开屏广告信息</div>
        <div className={sc('container-info-form')}>
          <Form
            {...formLayout} 
            form={contentInfoForm}
            validateTrigger={['onBlur']}
            onValuesChange={() => {
              setContentInfoFormChange(true);
            }}
          >
            <Form.Item
              label="活动名称" 
              name="advertiseName" 
              rules={[{ required: true, message: '必填' }]}
            >
              <Input maxLength={35} placeholder="请输入" allowClear />
            </Form.Item>
            <Form.Item
              label="图片" 
              name="imgs"
              extra="图片格式仅支持JPG、PNG、JPEG, 最多可上传十张。"
              rules={[{ required: true, message: '必填' }]}
            >
              <UploaImageV2 multiple={true} accept=".png,.jpeg,.jpg" maxCount={10}>
                <Button icon={<UploadOutlined />}>上传</Button>
              </UploaImageV2>
            </Form.Item>
            <Form.Item
              label="倒计时时长" 
              name="countdown"
              rules={[{ required: true, message: '必填' }]}
            >
              <Select options={[{label: '3秒', value: 3},{label: '4秒', value: 4},{label: '5秒', value: 5}]} placeholder="请选择" allowClear />
            </Form.Item>
            <Form.Item
              label="站内链接配置" 
              name="siteLink"
            >
              <Input placeholder="请输入" />
            </Form.Item>
            <Form.Item
              label="启动频率" 
              name="displayFrequency"
              rules={[{ required: true, message: '必填' }]}
            >
              <Select options={[{label: '每次', value: 'EVERY_TIME'},{label: '间隔一次', value: 'INTERVAL_ONE_TIME'},{label: '每天最多显示3次', value: 'DAY_THREE_TIMES'}]} placeholder="请选择" allowClear />
            </Form.Item>
          </Form>
        </div>
      </div>
      <Modal
        width={330}
        visible={visible}
        title="提示"
        onCancel={() => {
          setVisible(false);
        }}
        footer={[
          <Button key="back" onClick={() => setVisible(false)}>
            取消
          </Button>,
          <Button
            // key="submit"
            type="primary"
            onClick={() => {
              setContentInfoFormChange(false)
              history.push(`${routeName.BASELINE_OPERATIONS_MANAGEMENT_HOME_SCREEN_AD}`)
            }}
          >
            直接离开
          </Button>,
          <Button
            // key="submit"
            type="primary"
            onClick={() => {
              onSubmitDebounce(0)
            }}
          >
            暂存并离开
          </Button>,
        ]}
      >
        <p>数据未保存，是否仍要离开当前页面？</p>
      </Modal>
    </PageContainer>
  )
}