import { useEffect, useImperativeHandle, forwardRef } from 'react'
import { Button, Form } from 'antd';
import { cloneDeep } from 'lodash-es'
import { State } from '../store/state'
import { loadJsLink } from '../utils'
import { GenerateProvider } from '../store'
import GenerateFormItem from '../form/GenerateFormItem'
export interface GenerateFormProps {
  widgetInfoJson: string
  formValue?: Record<string, any>
  isMobile: boolean
}
export interface GenerateFormRef {
  getData: () => Promise<Record<string, any>>
  reset: () => void
}
const height = window.screen.availHeight
const GenerateForm = forwardRef<GenerateFormRef, GenerateFormProps>((props, ref) => {
  const { widgetInfoJson, formValue, isMobile } = props
  const [formInstance] = Form.useForm()
  useImperativeHandle(ref, () => ({
    getData: async () => {
      const validateResult = await formInstance.validateFields()
      return validateResult
    },
    reset: () => formInstance.resetFields()
  }))

  const widgetInfo: State = JSON.parse(widgetInfoJson)

  useEffect(() => {
    formInstance.setFieldsValue(cloneDeep(formValue))
    loadJsLink(widgetInfo.iconSrc)
  }, [])

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
            {widgetInfo.widgetFormList.map((widgetFormItem) => (
              <GenerateFormItem key={widgetFormItem.key} item={widgetFormItem} formInstance={formInstance} />
            ))}
          </Form>
          <Button type="primary" onClick={async () => {
            await formInstance.validateFields()
          }}>{widgetInfo?.globalConfig?.btnText}</Button>
        </div>
      </div>
    </div>
  )
})

GenerateForm.defaultProps = {
  formValue: {}
}

export default forwardRef<GenerateFormRef, GenerateFormProps>((props, ref) => {
  return (
    <GenerateProvider>
      <GenerateForm {...props} ref={ref} />
    </GenerateProvider>
  )
})
