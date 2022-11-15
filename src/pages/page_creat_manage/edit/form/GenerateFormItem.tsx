import React, { FC, useState } from 'react';
import {
  Form,
  FormInstance,
  Checkbox,
  Input,
  Radio, Modal,
} from 'antd';
import moment from 'moment'
import { isArray, isString } from 'lodash-es'
import { Component } from '../config'

interface Props {
  item: Component
  formInstance: FormInstance
}

const GenerateFormItem: FC<Props> = (props) => {
  const {
    item: { type, config, label, key, formItemConfig },
    formInstance
  } = props

  const commonProps: Record<string, any> = {
    ...config
  }
  const commonFormItemProps: Record<string, any> = {
    ...formItemConfig,
    name: key,
    label,
  }
  const [checkBoxValue, setCheckBoxValue] = useState(config?.defaultValue)
  if (['DatePicker', 'RangePicker', 'TimePicker'].includes(type) && formItemConfig?.initialValue) {
    if (isString(formItemConfig?.initialValue)) {
      commonFormItemProps.initialValue = moment(formItemConfig.initialValue, config?.format)
    }
    if (isArray(formItemConfig?.initialValue) && formItemConfig.initialValue.length === 2) {
      commonFormItemProps.initialValue = [moment(formItemConfig.initialValue[0], config?.format), moment(formItemConfig.initialValue[1], config?.format)]
    }
  }

  if (['Calendar'].includes(type) && config?.defaultValue) {
    commonProps.defaultValue = moment(commonProps.defaultValue)
  }
  const render = () => {
    return (
      <>
        {type === 'CheckboxGroup' && (
          <Form.Item
            label={label}
            required={config?.required}
          >
            {config?.desc && <div className="question-desc">{config.desc}</div>}
            <Form.Item
              rules={config?.required ? [{ required: true, message: '请选择选项'}] : []}
              name={key}
              getValueFromEvent={(value) => {
                const newValue = value.length > config?.maxLength ? value.slice(0, value.length - 1) : value
                formInstance.setFieldsValue({key: newValue})
                formInstance.validateFields([key || ''])
                return newValue
              }}
            >
              <Checkbox.Group
                options={config?.options}
                defaultValue={config?.defaultValue}
                value={checkBoxValue}
                onChange={(value)=>{
                  if (value.length > config?.maxLength){
                    Modal.info({
                      title: '提示',
                      content: `此题最多只能选择${config?.maxLength}项`,
                      okText: '我知道了',
                    });
                  }
                }}
              />
            </Form.Item>
          </Form.Item>
        )}
        {type === 'Input' && (
          <Form.Item
            label={label}
            required={config?.required}
          >
            {
              config?.desc && <div className="question-desc">{config.desc}</div>
            }
            <Form.Item
              name={key}
              rules={config?.required ? [{ required: true, message: '请输入内容'}] : []}
            >
              <Input
                allowClear={config?.allowClear}
                maxLength={config?.maxLength}
                placeholder={config?.placeholder}
              />
            </Form.Item>
          </Form.Item>
        )}
        {type === 'TextArea' && (
          <Form.Item
            label={label}
            required={config?.required}
          >
            {
              config?.desc && <div className="question-desc">{config.desc}</div>
            }
            <Form.Item
              name={key}
              rules={config?.required ? [{ required: true, message: '请输入内容'}] : []}
            >
              <Input.TextArea
                autoSize={config?.autoSize}
                maxLength={config?.maxLength}
                placeholder={config?.placeholder}
              />
            </Form.Item>
          </Form.Item>
        )}
        {type === 'RadioGroup' && (
          <Form.Item
            label={label}
            required={config?.required}
          >
            {
              config?.desc && <div className="question-desc">{config.desc}</div>
            }
            <Form.Item
              name={key}
              rules={config?.required ? [{ required: true, message: '请输入内容'}] : []}
            >
              <Radio.Group
                options={config?.options}
                optionType={config?.optionType}
                defaultValue={config?.defaultValue}
              />
            </Form.Item>
          </Form.Item>
        )}
      </>
    )
  }

  return render()
}

export default GenerateFormItem
