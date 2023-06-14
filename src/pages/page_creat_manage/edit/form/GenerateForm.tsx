import { useState } from 'react'
import { Button, Form, Input, Checkbox } from 'antd';
import { clone } from 'lodash-es'
import phoneIcon from '@/assets/page_creat_manage/icon_phone.png'
import codeIcon from '@/assets/page_creat_manage/icon_code.png'
import nameIcon from '@/assets/page_creat_manage/icon_name.png'
import successIcon from '@/assets/page_creat_manage/icon_success.png'
import logo from '@/assets/page_creat_manage/logo.png'
import { State } from '../store/state'
import { GenerateProvider } from '../store'
import GenerateFormItem from '../form/GenerateFormItem'
export interface GenerateFormProps {
  widgetInfoJson: string
  formValue?: Record<string, any>
  isMobile: boolean
  areaCodeOptions: {
    county: any[],
    city: any[],
    province: any[]
  }
}
export interface GenerateFormRef {
  getData: () => Promise<Record<string, any>>
  reset: () => void
}
const height = window.screen.availHeight
const GenerateForm = (props: GenerateFormProps) => {
  const { widgetInfoJson, isMobile, areaCodeOptions } = props
  const [widgetInfo, setWidgetInfo] = useState<State>(JSON.parse(widgetInfoJson))
  const [showSuccess, setShowSuccess] = useState<any>(false)
  const [formInstance] = Form.useForm()

  // 改变组件显示隐藏
  const clickCallBack = (showList: string[], controlList: string[]) => {
    const newWidgetInfo = clone(widgetInfo)
    const { widgetFormList } = newWidgetInfo
    newWidgetInfo.widgetFormList = widgetFormList.map((widgetFormItem) => {
      return {...widgetFormItem, hide: showList?.indexOf(widgetFormItem.key!) !== -1 ? false : controlList?.indexOf(widgetFormItem.key!) !== -1 ? true : widgetFormItem.hide}
    })
    setWidgetInfo(newWidgetInfo)
  }

  const { globalConfig } = widgetInfo || {}

  return (
    <div style={{height: `${height - 385}px`}} className={`preview-modal-box ${isMobile? ' mobile' : ''}`}>
      {
        showSuccess ?
          <div className="preview-body success-page">
            <img className="success-icon" src={successIcon} alt='' />
            <div className="success-title">{globalConfig?.successTitle || '提交成功'}</div>
            <div className="success-text">{globalConfig?.successSubTitle || '工业互联网，价值在羚羊快去羚羊平台逛逛吧！'}</div>
            {
              globalConfig.successConfigType === 'img' && (
                <div
                  style={{
                    width: `${isMobile ? globalConfig?.mobileImgWidth : globalConfig?.pcImgWidth}px`,
                    height: `${isMobile ? globalConfig?.mobileImgHeight : globalConfig?.pcImgHeight}px`
                  }}
                  className="img-box"
                >
                  <img src={isMobile ? globalConfig?.mobileImg : globalConfig.pcImg} alt='' />
                </div>
              )
            }
            {
              globalConfig.successConfigType === 'link' && (isMobile ? globalConfig.mobileLink : globalConfig.pcLink) && (
                <div className="link-info">
                  <div className="link">{isMobile ? globalConfig.mobileLink : globalConfig.pcLink}</div>
                  <div className="timer"><span>3</span>秒后自动跳转</div>
                  <Button
                    style={{boxShadow: 'none', borderColor: '#0068ff', color: '#fff', background: '#0068ff'}}
                    type="primary"
                  >立即跳转</Button>
                </div>
              )
            }
          </div> :
          <div className="preview-body"
               style={globalConfig?.bgColor ? {background: globalConfig?.bgColor} : {}}
          >
            {
              isMobile && globalConfig?.showPageName && <div className="mobile-title">{ globalConfig?.pageName}</div>
            }
            <div  className={globalConfig.formStyle === 'tiled' ? "body-title-box tiled" : "body-title-box"}>
              {
                globalConfig?.pageBg &&
                <img
                  src={`${globalConfig?.pageBg}`}
                  alt=''
                  className="page-bg"
                />
              }
              <div className="text-box">
                {
                  !isMobile && globalConfig?.showPageName &&
                  <div className="preview-page-title">{ globalConfig?.pageName}</div>
                }
                {
                  globalConfig?.showDesc &&
                  <div className="preview-page-desc">{ globalConfig?.pageDesc}</div>
                }
              </div>
            </div>
            <div className={globalConfig.formStyle === 'tiled' ? "preview-form tiled" : "preview-form"}>
              <Form {...widgetInfo.formConfig} form={formInstance}>
                {widgetInfo.widgetFormList.map((widgetFormItem: any) => (
                  <GenerateFormItem widgetInfo={widgetInfo} clickCallBack={clickCallBack} areaCodeOptions={areaCodeOptions} key={widgetFormItem.key} item={widgetFormItem} formInstance={formInstance} />
                ))}
                {
                  globalConfig.showRegister &&
                  <Form.Item
                    className="register-area real-form-area"
                    required
                    label={<span className="customer-label"><img className="official-logo" src={logo} alt='' /><span>欢迎注册羚羊平台</span> </span>}
                  >
                    <Form.Item
                      name="registerPhone"
                      validateTrigger="onBlur"
                      rules={[
                        { required: true, message: "请输入手机号码" },
                        {
                          pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
                          message: "请输入正确的11位手机号码",
                          validateTrigger: 'onBlur',
                        },
                      ]}
                      getValueFromEvent={(event) => event.target.value.replace(/[^\d+]/g, '')}
                    >
                      <Input
                        maxLength={11}
                        prefix={
                          <span className="action-icon">
                        <img src={phoneIcon} alt='' />
                      </span>
                        }
                        placeholder="手机号"
                        autoComplete="off"
                      />
                    </Form.Item>
                    <Form.Item
                      name="registerPhoneCode"
                      validateTrigger="onBlur"
                      rules={[
                        { required: true, message: "请输入验证码" },
                        {
                          pattern: /^\d{6}$/,
                          message: "请输入正确的验证码",
                          validateTrigger: 'onBlur',
                        },
                      ]}
                      getValueFromEvent={(event) => event.target.value.replace(/[^\d+]/g, '')}
                    >
                      <Input
                        placeholder="短信验证码"
                        autoComplete="off"
                        maxLength={6}
                        prefix={
                          <span className="action-icon">
                        <img src={codeIcon} alt='' />
                      </span>
                        }
                        addonAfter={
                          <div className="get-code-btn">
                            获取验证码
                          </div>
                        }
                      />
                    </Form.Item>
                    <Form.Item
                      name="registerName"
                      validateTrigger="onBlur"
                      rules={[
                        { required: true, message: "请输入姓名" },
                        {
                          validator(rule, value) {
                            if (value && value.indexOf('*') !== -1) {
                              return Promise.reject('请设置符合要求的姓名')
                            }
                            return Promise.resolve()
                          }
                        },
                      ]}
                      getValueFromEvent={(event) => event.target.value.replace(/[^\u4e00-\u9fa5a-zA-Z]/g, '')}
                    >
                      <Input
                        prefix={
                          <span className="action-icon">
                        <img src={nameIcon} alt='' />
                      </span>
                        }
                        placeholder="请输入姓名"
                        maxLength={35}
                      />
                    </Form.Item>
                    <Form.Item
                      name="agreement"
                      validateTrigger="onBlur"
                      valuePropName="checked"
                      rules={[
                        {
                          validator: (_, value) => {
                            if (value) {
                              return Promise.resolve()
                            }
                            return Promise.reject('请阅读并同意相关协议')
                          },
                        },
                      ]}
                    >
                      <Checkbox style={{ whiteSpace: 'nowrap' }}>
                        阅读并同意协议
                        <Button
                          type="link"
                          style={{ padding: 0, color: '#0068FF' }}
                        >
                          《用户协议》
                        </Button>
                        和
                        <Button
                          type="link"
                          style={{ padding: 0, color: '#0068FF' }}
                        >
                          《隐私协议》
                        </Button>
                      </Checkbox>
                    </Form.Item>
                  </Form.Item>
                }
              </Form>
              <Button
                style={{boxShadow: 'none', borderColor: widgetInfo?.globalConfig?.btnBgColor || '#0068ff', color: widgetInfo?.globalConfig?.textColor || '#fff', background: widgetInfo?.globalConfig?.btnBgColor || '#0068ff'}}
                type="primary"
                onClick={async () => {
                  setShowSuccess(true)
                }}
              >{widgetInfo?.globalConfig?.btnText}</Button>
            </div>
          </div>
      }
    </div>
  )
}


export default (props: GenerateFormProps) => {
  return (
    <GenerateProvider>
      <GenerateForm {...props} />
    </GenerateProvider>
  )
}
