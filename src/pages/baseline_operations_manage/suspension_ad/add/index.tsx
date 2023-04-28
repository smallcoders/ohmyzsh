import { Input, Form, Select, Button, message as antdMessage, Radio } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import scopedClasses from '@/utils/scopedClasses';
import { useEffect, useState } from 'react';
import UploaImageV2 from '@/components/upload_form/upload-image-v2';
import { addGlobalFloatAd, getGlobalFloatAdDetail, getPartLabels } from '@/services/baseline';
import { history, Prompt } from 'umi';
import './index.less';
import { UploadOutlined } from '@ant-design/icons';

const allLabels = [
  {
    label: '全部用户',
    value: 'ALL_USER'
  },
  {
    label: '全部登录用户',
    value: 'ALL_LOGIN_USE'
  },
  {
    label: '全部未登录用户',
    value: 'ALL_NOT_LOGIN_USE'
  }
]

const sc = scopedClasses('suspension-add');
export default () => {
  const [form] = Form.useForm();
  const { id } = history.location.query as { id: string | undefined };
  const [partLabels, setPartLabels] = useState<any>([])
  const [ userType, setUserType] = useState<any>('all')
  const [pageInfo, setPageInfo] = useState<any>({pageSize: 10, pageIndex: 1, pageTotal: 0})
  const [ cacheParams, setCacheParams] = useState<any>({
    scope: '',
    status: '',
    imgs: [],
    siteLink: '',
    advertiseType: 'GLOBAL_FLOAT_ADS',
    labelIds: '',
    advertiseName: '',
  })
  useEffect(() => {
    if (id){
      getGlobalFloatAdDetail({ id }).then((res) => {
        const { result, code, message: resultMsg } = res || {};
        if (code === 0) {
          console.log(result)
          setCacheParams({
            scope: result.scope,
            status: result.status,
            imgs: result.img,
            siteLink: result.siteLink,
            advertiseType: 'GLOBAL_FLOAT_ADS',
            labelIds: result.labelIds,
            advertiseName: result.advertiseName
          })
          form.setFieldsValue({
            advertiseName: result.advertiseName,
            labelIds: result.scope === 'PORTION_USER' ? result.labelIds : result.scope,
            siteLink: result.siteLink,
            userType: result.scope !== 'PORTION_USER' ? 'all' : 'part',
            imgs: result.imgs.length ? result.imgs?.map((item: any) => {
              return {
                uid: item,
                name: item,
                status: 'done',
                url: item
              }
            }) : []
          })
        } else {
          antdMessage.error(`请求失败，原因:{${resultMsg}}`);
        }
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

  const handleSubmit = async (status: number) => {
    await form.validateFields();
    const {advertiseName, imgs, siteLink, labelIds} = form.getFieldsValue()
    console.log(form.getFieldsValue())
    const params = {
      scope: userType === 'all' ? labelIds : 'PORTION_USER',
      status,
      imgs: imgs.map((item: any) => {
        return item.url
      }),
      siteLink,
      advertiseType: 'GLOBAL_FLOAT_ADS',
      labelIds: userType === 'all' ? [] : labelIds,
      advertiseName,
    }
    setCacheParams(params)
    console.log(params, '000000')
    // todo 先获取审核接口
    addGlobalFloatAd(params).then((res) => {
      if (res.code === 0){
        antdMessage.success('保存成功')
        if (status !== 0) {
          history.goBack()
        }
      } else {
        antdMessage.error(res.message)
      }
    })
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

  const isChanged = () => {
    const {advertiseName, imgs, siteLink, labelIds} = form.getFieldsValue()
    const params = {
      scope: userType === 'all' ? labelIds || '' : 'PORTION_USER',
      status: cacheParams.status || '',
      imgs: imgs?.map((item: any) => {
        return item.url
      }) || [],
      siteLink: siteLink || '',
      advertiseType: 'GLOBAL_FLOAT_ADS',
      labelIds: userType === 'all' ? '' : labelIds || [],
      advertiseName: advertiseName || '',
    }
    console.log(params, cacheParams)
    return JSON.stringify(params) !== JSON.stringify(cacheParams)
  }

  return (
    <PageContainer
      className={sc('page')}
      ghost
      footer={[
        <>
          <Button type="primary" onClick={() => {
            handleSubmit(1)
          }}>
            立即上架
          </Button>
          <Button onClick={() => {
            handleSubmit(0)
          }}>
            暂存
          </Button>
          <Button onClick={() => history.goBack()}>返回</Button>
        </>,
      ]}
    >
      <Prompt
        when={isChanged()}
        message={`数据未保存, 是否直接离开`}
      />
      <Form className={sc('container-form')} form={form}>
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
          extra="图片格式仅支持JPG、PNG、JPEG"
          labelCol={{span: 4}}
          wrapperCol={{span: 16}}
          rules={[
            {
              required: true,
              message: '必填',
            },
          ]}
        >
          <UploaImageV2 multiple={true} accept=".png,.jpeg,.jpg" maxCount={3}>
            <Button icon={<UploadOutlined />}>上传</Button>
          </UploaImageV2>
        </Form.Item>
        <Form.Item
          labelCol={{span: 4}}
          wrapperCol={{span: 12}}
          name="siteLink"
          label="站内链接配置"
          required
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
              form.setFieldsValue({labelIds: []})
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
            form.getFieldValue('userType') === 'part' ?
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
              /> : <Select
                options={allLabels}
                placeholder="请选择"
              />
          }
        </Form.Item>
      </Form>
    </PageContainer>
  );
};
