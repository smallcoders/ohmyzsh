import React, { FC } from 'react'
import {
  Form,
  InputNumber,
  Space
} from 'antd'
import { useConfig } from '../hooks/hooks'

const FormItemLayoutConfig: FC = () => {
  const { selectWidgetItem, handleChange } = useConfig()

  return (
    <>
      <h4>布局配置</h4>
      <Form.Item
        label={
          <Space>
            标签布局(24等分 span代表控件占有区域，offset代表偏移量)
            {selectWidgetItem?.formItemConfig?.labelCol && (
              <a
                href="/#"
                onClick={(event) => {
                  event.preventDefault()
                  handleChange(undefined, 'formItemConfig.labelCol')
                }}
              >
                还原
              </a>
            )}
          </Space>
        }
      >
        <span className="label">span</span>
        <InputNumber min={0} value={selectWidgetItem?.formItemConfig?.labelCol?.span} onChange={(value) => handleChange(value, 'formItemConfig.labelCol.span')} />
        <span className="label">offset</span>
        <InputNumber min={0} value={selectWidgetItem?.formItemConfig?.labelCol?.offset} onChange={(value) => handleChange(value, 'formItemConfig.labelCol.offset')} />
      </Form.Item>
      <Form.Item
        label={
          <Space>
            输入控件布局(24等分 span代表控件占有区域，offset代表偏移量)
            {selectWidgetItem?.formItemConfig?.wrapperCol && (
              <a
                href="/#"
                onClick={(event) => {
                  event.preventDefault()
                  handleChange(undefined, 'formItemConfig.wrapperCol')
                }}
              >
                还原
              </a>
            )}
          </Space>
        }
      >
        <span className="label">span</span>
        <InputNumber min={0} value={selectWidgetItem?.formItemConfig?.wrapperCol?.span} onChange={(value) => handleChange(value, 'formItemConfig.wrapperCol.span')} />
        <span className="label">offset</span>
        <InputNumber min={0} value={selectWidgetItem?.formItemConfig?.wrapperCol?.offset} onChange={(value) => handleChange(value, 'formItemConfig.wrapperCol.offset')} />
      </Form.Item>
    </>
  )
}

export default FormItemLayoutConfig
