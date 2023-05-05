import { Button, message as antdMessage, Select, Radio, Popconfirm, Form, Input, Breadcrumb, DatePicker, Modal } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { ExclamationCircleOutlined, UploadOutlined } from '@ant-design/icons';
import { history, Access, useAccess, Link, Prompt } from 'umi';
import './index.less';
import scopedClasses from '@/utils/scopedClasses';
import { addPopupAd, getGlobalFloatAdDetail, getAllLayout, getPartLabels } from '@/services/baseline';
import UploadFormFile from '@/components/upload_form/upload-form-asso';
import UploaImageV2 from '@/components/upload_form/upload-image-v2';
import { routeName } from '../../../../../config/routes';

const sc = scopedClasses('pop-up-ad-add');
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

export default () => {
  const [isClosejumpTooltip, setIsClosejumpTooltip] = useState<boolean>(true);
  const { id } = history.location.query as { id: string | undefined };
  const [loading, setLoading] = useState<any>(false);
  const [form] = Form.useForm();
  const formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 8 },
  };
  const [pageInfo, setPageInfo] = useState<any>({ pageSize: 10, pageIndex: 1, pageTotal: 0 })
  const [userType, setUserType] = useState<any>('all')
  const [partLabels, setPartLabels] = useState<any>([])
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false)

  const onTimeChange = (e: any) => {
    if (e.target.value === 'FIXED_TIME') {
      setShowDatePicker(true)
    } else {
      setShowDatePicker(false)
    }
  }

  const onSubmit = async (status: number, isPrompt?: boolean) => {
    await form.validateFields();
    const { 
      advertiseName, //名称
      imgs, //图片
      siteLink, //站内链接
      labelIds, 
      regularTime, //固定时间所选时间段
      periodType, //开启时间类型 全部时间（ALL_TIME），固定时间(FIXED_TIME)
      triggerMechanism, //触发机制
      triggerAddress //触发机制地址
    } = form.getFieldsValue()
    const params: any = {
      scope: userType === 'all' ? labelIds : 'PORTION_USER',
      status,
      imgs: imgs && imgs.length > 0 ? imgs.map((item: any) => {
        return {path: item.url, id: item.resData?.id || item.uid}
      }) : [],
      siteLink,
      advertiseType: 'POP_UP_ADS',
      labelIds: userType === 'all' ? [] : labelIds,
      advertiseName,
      triggerMechanism,
      periodType,
      triggerAddress
    }
    if (id) {
      params.id = id
    }
    if (periodType == 'FIXED_TIME' && regularTime) {
      params.periodStartTime = moment(regularTime[0]).format('YYYY-MM-DD');
      params.periodEndTime = moment(regularTime[1]).format('YYYY-MM-DD');
    }
    if (status == 1) {
      Modal.confirm({
        title: '提示',
        content: '确定上架当前内容？',
        okText: '上架',
        onOk: () => {
          addPopupAd(params).then((res) => {
            if (res.code === 0) {
              setIsClosejumpTooltip(false)
              antdMessage.success('上架成功')
              history.goBack()
            } else {
              antdMessage.error(res.message)
            }
          })
        },
      })
    } else {
      addPopupAd(params).then((res) => {
        if (res.code === 0) {
          setIsClosejumpTooltip(false)
          antdMessage.success('暂存成功')
          if (isPrompt) {
            history.goBack()
          }
        } else {
          antdMessage.error(res.message)
        }
      })
    }
  }

  const getLabels = (pageIndex: number) => {
    getPartLabels({ pageIndex, pageSize: pageInfo.pageSize }).then((res) => {
      if (res.code === 0 && res.result) {
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

  useEffect(() => {
    if (id) {
      setLoading(true)
      getGlobalFloatAdDetail(id).then((res) => {
        const { result, code, message: resultMsg } = res || {};
        if (code === 0) {
          form.setFieldsValue({
            advertiseName: result.advertiseName,
            labelIds: result.scope === 'PORTION_USER' ? result.labelIds : result.scope,
            siteLink: result.siteLink,
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
      form.setFieldsValue({ userType: 'all', periodType: 'ALL_TIME', triggerMechanism: 'PAGE_START' })
    }
    getPartLabels({ ...pageInfo }).then((res) => {
      if (res.code === 0 && res.result) {
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

  return (
    <PageContainer
      loading={loading}
      header={{
        title: '新增',
        breadcrumb: (
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to="/baseline-operations-management/pop-up-ad">全局悬浮窗广告</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>新增</Breadcrumb.Item>
          </Breadcrumb>
        ),
      }}
      footer={[
        <Button type="primary" onClick={() => onSubmit(1)}>立即上架</Button>,
        <Button onClick={() => onSubmit(0)}>暂存</Button>,
        <Button onClick={() => history.push(routeName.BASELINE_OPERATIONS_MANAGEMENT_POPUP_AD)}>返回</Button>,
      ]}
    >
      <Prompt
        when={isClosejumpTooltip}
        message={(location: any) => {
          Modal.confirm({
            title: '要在离开之前对填写的信息进行保存吗?',
            icon: <ExclamationCircleOutlined />,
            cancelText: '放弃修改并离开',
            okText: '暂存并离开',
            onCancel() {
              setIsClosejumpTooltip(false)
              setTimeout(() => {
                history.push(location.pathname);
              }, 1000);
            },
            onOk() {
              onSubmit(0, true)
            },
          });
          return false;
        }}
      />
      <div className={sc('container')}>
        <Form
          form={form}
          name="basic"
          {...formLayout}
          validateTrigger={['onBlur']}
        >
          <Form.Item
            label="活动名称"
            name="advertiseName"
            rules={[{ required: true, message: '请输入' }]}
          >
            <Input placeholder="请输入" maxLength={35} />
          </Form.Item>
          <Form.Item label="图片" name="imgs" rules={[{ required: true, message: '必填' }]}>
            <UploaImageV2 multiple={true} maxCount={1} accept=".png,.jpeg,.jpg,.gif">
              <Button icon={<UploadOutlined />}>上传</Button>
            </UploaImageV2>
            {/* <UploadFormFile
              listType="picture-card"
              className="avatar-uploader"
              maxCount={1}
              accept=".png,.jpeg,.jpg,.gif"
              tooltip={<span className={'tooltip'}>图片格式仅支持JPG、PNG、JPEG、GIF</span>}
            /> */}
          </Form.Item>
          <Form.Item
            label="站内链接配置"
            name="siteLink"
          >
            <Input placeholder="请输入" allowClear />
          </Form.Item>
          <Form.Item label="触发机制"
            name="triggerMechanism"
            rules={[{ required: true, message: '请选择' }]}
          >
            <Radio.Group>
              <Radio value='PAGE_START'>页面启动</Radio>
              <Radio value='PAGE_CLOSE'>页面离开</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label=""
            wrapperCol={{ offset: 4, span: 8 }}
            name="triggerAddress"
          >
            <Input placeholder="请输入页面地址" allowClear />
          </Form.Item>
          <Form.Item
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
            wrapperCol={{offset: 4, span: 8}}
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
          <Form.Item label="开启时间段"
            name="periodType"
            rules={[{ required: true, message: '请选择' }]}
          >
            <Radio.Group onChange={onTimeChange}>
              <Radio value='ALL_TIME'>全部时间</Radio>
              <Radio value='FIXED_TIME'>固定时间</Radio>
            </Radio.Group>
          </Form.Item>
          {
            showDatePicker && (
              <Form.Item
                label=""
                wrapperCol={{ offset: 4, span: 8 }}
                name="regularTime"
              >
                <DatePicker.RangePicker allowClear />
              </Form.Item>
            )
          }
        </Form>
      </div>
    </PageContainer>
  )
}