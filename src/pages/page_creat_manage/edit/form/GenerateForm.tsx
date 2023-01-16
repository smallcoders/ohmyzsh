import { useState } from 'react'
import { Button, Form, Input, Checkbox } from 'antd';
import { clone } from 'lodash-es'
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

  return (
    <div style={{height: `${height - 385}px`}} className={`preview-modal-box ${isMobile? ' mobile' : ''}`}>
      <div className="preview-body"
           style={widgetInfo?.globalConfig?.bgColor ? {background: widgetInfo?.globalConfig?.bgColor} : {}}
      >
        {
          isMobile && widgetInfo?.globalConfig?.showPageName && <div className="mobile-title">{ widgetInfo?.globalConfig?.pageName}</div>
        }
        <div  className="body-title-box">
          {
            widgetInfo?.globalConfig?.pageBg &&
            <img
              src={`${widgetInfo?.globalConfig?.pageBg}`}
              alt=''
              className="page-bg"
            />
          }
          <div className="text-box">
            {
              !isMobile && widgetInfo?.globalConfig?.showPageName &&
              <div className="preview-page-title">{ widgetInfo?.globalConfig?.pageName}</div>
            }
            {
              widgetInfo?.globalConfig?.showDesc &&
              <div className="preview-page-desc">{ widgetInfo?.globalConfig?.pageDesc}</div>
            }
          </div>
        </div>
        <div className="preview-form">
          <Form {...widgetInfo.formConfig} form={formInstance}>
            {widgetInfo.widgetFormList.map((widgetFormItem: any) => (
              <GenerateFormItem widgetInfo={widgetInfo} clickCallBack={clickCallBack} areaCodeOptions={areaCodeOptions} key={widgetFormItem.key} item={widgetFormItem} formInstance={formInstance} />
            ))}
            {
              widgetInfo.globalConfig.showRegister &&
              <Form.Item
                label="欢迎注册羚羊平台"
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
                  getValueFromEvent={(event) => event.target.value.replace(/\d/g, '')}
                >
                  <Input
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
            style={{borderColor: widgetInfo?.globalConfig?.btnBgColor || '#0068ff', color: widgetInfo?.globalConfig?.textColor || '#fff', background: widgetInfo?.globalConfig?.btnBgColor || '#0068ff'}}
            type="primary"
            onClick={async () => {
              await formInstance.validateFields()
            }}
          >{widgetInfo?.globalConfig?.btnText}</Button>
        </div>
      </div>
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
