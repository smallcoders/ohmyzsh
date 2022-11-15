import React, { useEffect, useImperativeHandle, forwardRef } from 'react'
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
    <div className={`preview-modal-box ${isMobile? ' mobile' : ''}`}>
      <div className="preview-body">
        <div  className="body-title-box">
          {
            widgetInfo?.globalConfig?.showPageName &&
            <div className="preview-page-title">{ widgetInfo?.globalConfig?.pageName}</div>
          }
          {
            widgetInfo?.globalConfig?.showDesc &&
            <div className="preview-page-desc">{ widgetInfo?.globalConfig?.pageDesc}</div>
          }
        </div>
        <div className="preview-form">
          <Form {...widgetInfo.formConfig} form={formInstance}>
            {widgetInfo.widgetFormList.map((widgetFormItem) => (
              <GenerateFormItem key={widgetFormItem.key} item={widgetFormItem} formInstance={formInstance} />
            ))}
          </Form>
          <Button type={"primary"} onClick={async () => {
            const validateResult = await formInstance.validateFields()
            console.log(validateResult)
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
