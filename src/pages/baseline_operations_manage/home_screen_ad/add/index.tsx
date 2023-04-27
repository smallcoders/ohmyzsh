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

const sc = scopedClasses('home-screen-ad-add');

type RouterParams = {
  type?: string;
  id?: string;
};
const { confirm } = Modal;
export default () => {
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
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };
  // 内容信息form
  const [contentInfoForm] = Form.useForm();
  // 基础信息的改变
  const [contentInfoFormChange, setContentInfoFormChange] = useState<boolean>(false);
  // 请求数据中
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const onSubmitDebounce = debounce((state) => {
    onSubmit(state)
  },1000)
  const onSubmit = (state: number) => {
    if (state === 1) {
      contentInfoForm.validateFields().then((values: any) => {
        console.log('上架搜集的表单', values)
      })
    } else {
      const formValues = contentInfoForm.getFieldsValue();
      console.log('暂存搜集的表单', formValues)
    }
  }
  const goBack = () => {
    setTimeout(() => {
      history.push(`${routeName.BASELINE_OPERATIONS_MANAGEMENT_HOME_SCREEN_AD}`)
      // history.goBack();
    },800)
  }
  /**
   * 当前的新增还是编辑
   */
  const { type, id } = history.location.query as RouterParams;
  const [activeTitle, setActiveTitle] = useState<any>('新增');

  // const [detail, setDetail] = useState<any>()
  const perpaer = async (id: any) => {
    try {
      const res = await httpMngDetail(id)
      if (res?.code === 0) {
        const detail = res?.result;

        contentInfoForm.setFieldsValue({
          ...detail,
          // 需要再根据返回值调整
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
      contentInfoForm.setFieldsValue({ countdown: 1 })
      contentInfoForm.setFieldsValue({ displayFrequency: 1 })
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
              <Link to={routeName.BASELINE_OPERATIONS_MANAGEMENT_HOME_SCREEN_AD}>开屏广告</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{activeTitle}</Breadcrumb.Item>
          </Breadcrumb>
        ),
      }}
      footer={[
        // access后端根据
        // <Access accessible={access['PA_BLM_NRGL']}>
        <React.Fragment>
          {/* {!isTry && (
            <Popconfirm
              title={
                <div>
                  <div>提示</div>
                  <div>若设定预约发布，则会在设定的时间进行发布</div>
                </div>
              }
              okText="发布"
              cancelText="取消"
              onConfirm={() => onSubmitDebounce(1)}
            >
              <Button disabled={isExporting} type="primary" htmlType="submit">
                发布
              </Button>
            </Popconfirm>
          )}
          {isTry && (
            <Button disabled={isExporting} type="primary" htmlType="submit" onClick={() => onSubmitDebounce(1)}>
              发布
            </Button>
          )} */}
            <Popconfirm
              title={
                <div>
                  <div>提示</div>
                  <div>确定上架当前内容？</div>
                </div>
              }
              okText="发布"
              cancelText="取消"
              onConfirm={() => onSubmitDebounce(1)}
            >
              {/* <Button type="primary" htmlType="submit"  onClick={() => onSubmit(1)}> */}
              <Button disabled={isExporting} type="primary" htmlType="submit">
                立即上架
              </Button>
            </Popconfirm>
        </React.Fragment>,
        // </Access>,
        // <Access accessible={access['PA_BLM_NRGL']}>
        <React.Fragment>
          <Button disabled={isExporting} onClick={() => onSubmitDebounce(2)}>暂存</Button>
        </React.Fragment>,
        // </Access>,
        <Button onClick={() => {
          if (contentInfoFormChange) {
            setVisible(true);
          } else {
            history.push(`${routeName.BASELINE_OPERATIONS_MANAGEMENT_HOME_SCREEN_AD}`)
          }
        }}>返回</Button>,
      ]}
    >
      <Prompt
        when={contentInfoFormChange}
        message={'离开此页面，将不会保存当前编辑的内容，确认离开吗？'}
        // message={(location) => {
        //   // 可以拿到之前的路由,和参数
        //   // console.log('location', location)
        //   confirm({
        //     title: '要在离开之前对填写的信息进行保存吗?',
        //     icon: null,
        //     // cancelText: '放弃修改并离开',
        //     // okText: '保存',
        //     onCancel() {
        //       // console.log(location);
        //       // setFormIsChange(false);
        //       // setTimeout(() => {
        //       //   history.push(location.pathname);
        //       // }, 1000);
        //     },
        //     onOk() {
        //       // onOk(() => {
        //       //   setFormIsChange(false);
        //       //   setTimeout(() => {
        //       //     history.push(location.pathname);
        //       //   }, 1000);
        //       // });
        //     },
        //   });
        //   return false;
        // }}
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
              label="名称" 
              name="advertiseName" 
              rules={[{ required: true, message: '必填' }]}
            >
              <Input maxLength={35} placeholder="请输入" allowClear />
            </Form.Item>
            <Form.Item
              label="图片" 
              name="图片"
              rules={[{ required: true, message: '必填' }]}
            >
              <UploadForm
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                accept=".png,.jpeg,.jpg"
                tooltip={<span className={'tooltip'}>图片格式仅支持JPG、PNG、JPEG</span>}
                // setValue={(e) => coverOnChange(e)}
              />
            </Form.Item>
            <Form.Item
              label="倒计时时长" 
              name="countdown"
              rules={[{ required: true, message: '必填' }]}
            >
              <Select options={[{label: '3秒', value: 1},{label: '4秒', value: 2},{label: '5秒', value: 3}]} placeholder="请选择" allowClear />
            </Form.Item>
            <Form.Item
              label="站内链接配置" 
              name="siteLink"
            >
              <Input addonBefore="http://" addonAfter=".com" placeholder="请输入" />
            </Form.Item>
            <Form.Item
              label="启动频率" 
              name="displayFrequency"
              rules={[{ required: true, message: '必填' }]}
            >
              <Select options={[{label: '每次', value: 1},{label: '间隔一次', value: 2},{label: '每天最多显示3次', value: 3}]} placeholder="请选择" allowClear />
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
              goBack()
              // history.push(`${routeName.BASELINE_OPERATIONS_MANAGEMENT_HOME_SCREEN_AD}`)
            }}
          >
            直接离开
          </Button>,
          <Button
            // key="submit"
            type="primary"
            onClick={() => {
              onSubmitDebounce(2)
              // goBack()
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