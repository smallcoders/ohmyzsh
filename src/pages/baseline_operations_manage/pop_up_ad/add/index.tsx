import { Button, message, Select, Radio, Popconfirm, Form, Input, Breadcrumb, DatePicker } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { history, Access, useAccess, Link, Prompt } from 'umi';
import './index.less';
import scopedClasses from '@/utils/scopedClasses';
import { addGlobalFloatAd, getGlobalFloatAdDetail, getAllLayout, getPartLabels } from '@/services/baseline';
import UploadFormFile from '@/components/upload_form/upload-form-file';
import { routeName } from '../../../../../config/routes';

const sc = scopedClasses('pop-up-ad-add');


export default () => {
  const [isClosejumpTooltip, setIsClosejumpTooltip] = useState<boolean>(true);
  const { id } = history.location.query as { id: string | undefined };
  const [form] = Form.useForm();
  const formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 8 },
  };
  const [pageInfo, setPageInfo] = useState<any>({pageSize: 10, pageIndex: 1, pageTotal: 0})
  const [ userType, setUserType] = useState<any>('all')
  const [partLabels, setPartLabels] = useState<any>([])
  const [allLabels, setAllLabels] = useState<any>([])
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false)

  const onRadioChange = (e: any) => {
    console.log(e.target, '<-----e.target');
    // setCheckNick(!e.target.value);
  };

  const onTimeChange = (e: any) => {
    console.log(e.target, '<-----e.target');
    if(e.target.value === '2') {
      setShowDatePicker(true)
    } else {
      setShowDatePicker(false)
    }
  }

  const onSubmit = async (status: number) => {
    console.log(status)
    await form.validateFields();
    const {advertiseName, imgs, siteLink, labelIds, regularTime, periodType} = form.getFieldsValue()
    const params: any = {
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
    if (id) {
      params.id = id
    }
    if (periodType == '2' && regularTime) {
      params.periodStartTime = moment(regularTime[0]).format('YYYY-MM-DD');
      params.periodEndTime = moment(regularTime[1]).format('YYYY-MM-DD');
    }
    const cb = async () => {
      // const res = await (id ? editArticle({ id, ...data, status }) : addArticle({ ...data, status }))
      // if (res?.code == 0) {
      //   message.success('操作成功')
      //   setIsClosejumpTooltip(false);
      //   status == 1 && history.push(routeName.BASELINE_CONTENT_MANAGE)
      // } else {
      //   message.error(res?.message || '操作失败')
      // }
    }
  
    //   if (status == 1) {
    //     await form.validateFields()
    //     Modal.confirm({
    //       title: '提示',
    //       content: '确定将内容上架？',
    //       onOk: async () => {
    //         beforeUp(data.content, cb)
    //       },
    //       onCancel: () => {
    //         return
    //       },
    //       okText: '上架'
    //     })
    //   } else {
    //     cb()
    //   }
  }

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

  useEffect(() => {
    if (id){
      getGlobalFloatAdDetail({ id }).then((res) => {
        const { result, code, message: resultMsg } = res || {};
        if (code === 0) {
          console.log(result)
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
      form.setFieldsValue({userType: 'all', periodType: '1', triggerMechanism: '1'})
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

  return (
    <PageContainer
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
        <Button onClick={() => onSubmit(2)}>暂存</Button>,
        <Button onClick={() => history.push(routeName.BASELINE_OPERATIONS_MANAGEMENT_POPUP_AD)}>返回</Button>,
      ]}
    >
      <Prompt
        when={isClosejumpTooltip}
        message={'离开此页面，将不会保存当前编辑的内容，确认离开吗？'}
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
            <UploadFormFile
                showUploadList={false}
                listType="picture-card"
                className="avatar-uploader"
                accept=".png,.jpeg,.jpg,.gif"
                tooltip={
                  <span className={'tooltip'}>图片格式仅支持JPG、PNG、JPEG、GIF</span>
                }
              >
                + 上传
              </UploadFormFile>
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
                <Radio value='1'>页面启动</Radio>
                <Radio value='2'>页面离开</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              label=""
              wrapperCol={{offset: 4, span: 8}}
              name="triggerAddress"
            >
              <Input placeholder="请输入页面地址" allowClear />
            </Form.Item>
            <Form.Item label="作用范围"
              name="userType"
              rules={[{ required: true, message: '请选择' }]}
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
              label=""
              rules={[
                {
                  required: true,
                  message: '必选',
                },
              ]}
              validateTrigger="onBlur"
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
            <Form.Item label="开启时间段"
              name="periodType"
              rules={[{ required: true, message: '请选择' }]}
            >
              <Radio.Group onChange={onTimeChange}>
                <Radio value='1'>全部时间</Radio>
                <Radio value='2'>固定时间</Radio>
              </Radio.Group>
            </Form.Item>
            {
              showDatePicker && (
                <Form.Item
                  label=""
                  wrapperCol={{offset: 4, span: 8}}
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