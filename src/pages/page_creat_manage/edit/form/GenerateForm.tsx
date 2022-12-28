import { useState } from 'react'
import { Button, Form } from 'antd';
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
      <div className="preview-body">
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
          </Form>
          <Button type="primary" onClick={async () => {
            await formInstance.validateFields()
          }}>{widgetInfo?.globalConfig?.btnText}</Button>
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
