import { Input, Form, Select, Button, message as antdMessage, Radio, Modal, Breadcrumb } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import scopedClasses from '@/utils/scopedClasses';
import React, { useEffect, useState } from 'react';
import UploaImageV2 from '@/components/upload_form/upload-image-v2';
import { addGlobalFloatAd, getGlobalFloatAdDetail, getPartLabels, auditImgs } from '@/services/baseline';
import { history, Link, Prompt } from 'umi';
import './index.less';
import { ExclamationCircleOutlined, UploadOutlined } from '@ant-design/icons';
import { routeName } from '../../../../../config/routes';

const allLabels = [
  {
    label: '全部用户',
    value: 'ALL_USER'
  },
  {
    label: '全部登录用户',
    value: 'ALL_LOGIN_USER'
  },
  {
    label: '全部未登录用户',
    value: 'ALL_NOT_LOGIN_USER'
  }
]

const sc = scopedClasses('suspension-add');
export default () => {
  const [form] = Form.useForm();
  const { id } = history.location.query as { id: string | undefined };
  const [loading, setLoading] = useState<any>(false);
  const [partLabels, setPartLabels] = useState<any>([])
  const [formIsChange, setFormIsChange] = useState<boolean>(false);
  const [ userType, setUserType] = useState<any>('all')
  const [pageInfo, setPageInfo] = useState<any>({pageSize: 10, pageIndex: 1, pageTotal: 0})
  useEffect(() => {
    if (id){
      setLoading(true)
      getGlobalFloatAdDetail(id).then((res) => {
        const { result, code, message: resultMsg } = res || {};
        if (code === 0) {
          setUserType(result.scope !== 'PORTION_USER' ? 'all' : 'part')
          form.setFieldsValue({
            advertiseName: result.advertiseName,
            labelIds: result.scope === 'PORTION_USER' ? result.labelIds : result.scope,
            siteLink: result.siteLink,
            triggerAddress: result.triggerAddress,
            userType: result.scope !== 'PORTION_USER' ? 'all' : 'part',
            imgs: result.imgRelations?.length ? result.imgRelations?.map((item: any) => {
              return {
                uid: `${item.fileId}`,
                name: item.ossUrl,
                status: 'done',
                url: item.ossUrl
              }
            }) : []
          })
        } else {
          antdMessage.error(`请求失败，原因:{${resultMsg}}`);
        }
      }).finally(() => {
        setLoading(false)
      });
    } else {
      form.setFieldsValue({userType: 'all'})
    }
    getPartLabels({ ...pageInfo }).then((res) => {
      if (res.code === 0 && res.result){
        const labelArr = res.result.map((item: any) => {
          return {
            value: item.id,
            label: item.labelName
          }
        })
        setPageInfo({
          ...pageInfo, pageTotal: Math.ceil(res.totalCount / pageInfo.pageSize)
        })
        setPartLabels(labelArr)
      }
    })
  }, []);

  const handleSubmit = async (status: number, isPrompt?: boolean) => {
    if (status === 1){
      await form.validateFields();
    }
    const {advertiseName, imgs, siteLink, labelIds, triggerAddress} = form.getFieldsValue()
    const params: any = {
      scope: userType === 'all' ? labelIds || '' : 'PORTION_USER',
      status,
      imgs: imgs?.map((item: any) => {
        return {path: item.url, id: item.resData?.id || item.uid}
      }) || [],
      siteLink: siteLink || '',
      advertiseType: 'GLOBAL_FLOAT_ADS',
      triggerAddress: triggerAddress || '',
      labelIds: userType === 'all' ? [] : labelIds || [],
      advertiseName: advertiseName || '',
    }
    if (id) {
      params.id = parseInt(id)
    }
    if (status === 1){
      Modal.confirm({
        title: '提示',
        content: '确定上架当前内容？',
        okText: '上架',
        onOk: () => {
          auditImgs({
            ossUrls: params.imgs.map((item: any) => {return item.path})
          }).then((result) => {
            if (result.code === 0){
              addGlobalFloatAd(params).then((res) => {
                if (res.code === 0){
                  setFormIsChange(false)
                  antdMessage.success('上架成功')
                  history.push(routeName.BASELINE_OPERATIONS_MANAGEMENT_SUSPENSION_AD)
                } else {
                  antdMessage.error(res.message)
                }
              })
            } else {
              Modal.confirm({
                title: '风险提示',
                content: result.message,
                okText: '继续上架',
                onOk: () => {
                  addGlobalFloatAd(params).then((res) => {
                    if (res.code === 0){
                      setFormIsChange(false)
                      antdMessage.success('上架成功')
                      history.push(routeName.BASELINE_OPERATIONS_MANAGEMENT_SUSPENSION_AD)
                    } else {
                      antdMessage.error(res.message)
                    }
                  })
                }
              })
            }
          })
        },
      })
    } else {
      addGlobalFloatAd(params).then((res) => {
        if (res.code === 0){
          setFormIsChange(false)
          antdMessage.success('暂存成功')
          if (isPrompt){
            history.push(routeName.BASELINE_OPERATIONS_MANAGEMENT_SUSPENSION_AD)
          }
        } else {
          antdMessage.error(res.message)
        }
      })
    }
  };

  const getLabels = (pageIndex: number) => {
    getPartLabels({pageIndex, pageSize: pageInfo.pageSize}).then((res) => {
      if (res.code === 0 && res.result){
        const labelArr = res.result.map((item: any) => {
          return {
            value: item.id,
            label: item.labelName
          }
        })
        setPageInfo({
          ...pageInfo, pageTotal: Math.ceil(res.result.totalCount / pageInfo.pageSize)
        })
        setPartLabels(partLabels.concat(labelArr))
      } else {
        setPageInfo({
          ...pageInfo, pageIndex: pageInfo.pageIndex - 1
        })
      }
    }).catch(() => {
      setPageInfo({
        ...pageInfo, pageIndex: pageInfo.pageIndex - 1
      })
    })
  }

  return (
    <PageContainer
      className={sc('page')}
      ghost
      loading={loading}
      header={{
        title: id ? '编辑' : '新增',
        breadcrumb: (
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to={routeName.BASELINE_OPERATIONS_MANAGEMENT}>基线运营位管理</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to={routeName.BASELINE_OPERATIONS_MANAGEMENT_SUSPENSION_AD}>开屏广告</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{id ? '编辑' : '新增'}</Breadcrumb.Item>
          </Breadcrumb>
        ),
      }}
      footer={[
        <>
          <Button key={1} type="primary" onClick={() => {
            handleSubmit(1)
          }}>
            立即上架
          </Button>
          <Button key={2} onClick={() => {
            handleSubmit(0)
          }}>
            暂存
          </Button>
          <Button key={3} onClick={() => history.push(routeName.BASELINE_OPERATIONS_MANAGEMENT_SUSPENSION_AD)}>返回</Button>
        </>,
      ]}
    >
      <Prompt
        when={formIsChange}
        message={(location: any) => {
          Modal.confirm({
            title: '要在离开之前对填写的信息进行保存吗?',
            icon: <ExclamationCircleOutlined />,
            cancelText: '放弃修改并离开',
            okText: '暂存并离开',
            onCancel() {
              setFormIsChange(false)
              setTimeout(() => {
                history.push(location.pathname);
              }, 100);
            },
            onOk() {
              handleSubmit(0, true)
            },
          });
          return false;
        }}
      />
      <Form
        className={sc('container-form')}
        form={form}
        onValuesChange={() => {
          setFormIsChange(true)
        }}
      >
        <div className="title">全局悬浮窗广告信息</div>
        <Form.Item
          labelCol={{span: 4}}
          wrapperCol={{span: 12}}
          name="advertiseName"
          label="活动名称"
          required
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
          name="imgs"
          label="图片"
          required
          extra="图片格式仅支持JPG、PNG、JPEG，图片尺寸192*192"
          labelCol={{span: 4}}
          wrapperCol={{span: 16}}
          rules={[
            {
              required: true,
              message: '必填',
            },
          ]}
        >
          <UploaImageV2 multiple={true} accept=".png,.jpeg,.jpg" maxCount={1}>
            <Button icon={<UploadOutlined />}>上传</Button>
          </UploaImageV2>
        </Form.Item>
        <Form.Item
          labelCol={{span: 4}}
          wrapperCol={{span: 12}}
          name="triggerAddress"
          label="触发地址"
          required
        >
          <Input placeholder="请输入页面地址" />
        </Form.Item>
        <Form.Item
          labelCol={{span: 4}}
          wrapperCol={{span: 12}}
          name="siteLink"
          label="站内链接配置"
        >
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item
          labelCol={{span: 4}}
          wrapperCol={{span: 12}}
          name="userType"
          label="作用范围"
          required
          rules={[
            {
              required: true,
              message: '必选',
            },
          ]}
        >
          <Radio.Group
            onChange={(e) => {
              form.setFieldsValue(e.target.value === 'all' ? {labelIds: ''} : {labelIds: []})
              setUserType(e.target.value)
            }}
            options={[{label: '全部用户', value: 'all'}, {label: '部分用户', value: 'part'}]}
          />
        </Form.Item>
        <Form.Item
          wrapperCol={{offset: 4, span: 12}}
          name="labelIds"
          required
          validateTrigger="onBlur"
          rules={[
            {
              required: true,
              message: '必选',
            },
          ]}
        >
          {
            form.getFieldValue('userType') === 'part' && partLabels.length ?
              <Select
                options={partLabels}
                mode={'multiple'}
                placeholder="请选择"
                onPopupScroll={() => {
                  if (pageInfo.pageTotal > pageInfo.pageIndex) {
                    const pageIndex = pageInfo.pageIndex + 1
                    setPageInfo({...pageInfo, pageIndex})
                    getLabels(pageIndex)
                  }
                }}
              /> : form.getFieldValue('userType') === 'all' ? <Select
                options={allLabels}
                placeholder="请选择"
              /> : null
          }
        </Form.Item>
      </Form>
    </PageContainer>
  );
};
