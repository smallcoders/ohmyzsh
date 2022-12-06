import { useEffect, useState } from 'react';
import {
  Form,
  FormInstance,
  Checkbox,
  Input,
  Radio, Modal, Select, DatePicker, Cascader,
} from 'antd';
import { Component } from '../config'

interface Props {
  item: Component
  formInstance: FormInstance
  areaCodeOptions: {
    countyOptions: any[],
    cityOptions: any[],
  }
  clickCallBack: (showList: string[], controlList: string[]) => void
}

const GenerateFormItem = (props: Props) => {
  const {
    item: { type, config, label, key, show },
    formInstance,
    areaCodeOptions
  } = props
  useEffect(() => {
    if (config?.defaultValue){
      formInstance.setFieldsValue({
        [key!]: config.defaultValue
      })
    }
  }, [config?.defaultValue])
  const [checkBoxValue, setCheckBoxValue] = useState<string[]>(config?.defaultValue || [])
  const [mulSelectValue, setMulSelectValue] = useState<string[]>(config?.defaultValue || [])

  return (
    <>
      {type === 'CheckboxGroup' && show && (
        <Form.Item
          label={config?.showLabel ? label : ''}
          required={config?.required}
        >
          {config?.desc && <div className="question-desc">{config.desc}</div>}
          <Form.Item
            rules={config?.required ? [{ required: true, message: '请选择选项'}] : []}
            name={key}
            getValueFromEvent={(value) => {
              const newValue = value.length > config?.maxLength ? value.filter((checkItem: string) => {
                return checkBoxValue.indexOf(checkItem) !== -1
              }): value
              formInstance.setFieldsValue({key: newValue})
              setCheckBoxValue(newValue)
              return newValue
            }}
          >
            <Checkbox.Group
              options={config?.options}
              defaultValue={config?.defaultValue}
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
      {type === 'Input' && show && (
        <Form.Item
          label={config?.showLabel ? label : ''}
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
      {type === 'TextArea' && show && (
        <Form.Item
          label={config?.showLabel ? label : ''}
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
              rows={4}
              // autoSize={config?.autoSize}
              maxLength={config?.maxLength}
              placeholder={config?.placeholder}
            />
          </Form.Item>
        </Form.Item>
      )}
      {type === 'RadioGroup' && show && (
        <Form.Item
          label={config?.showLabel ? label : ''}
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
              onChange={(value) => {
                console.log(value, 'Radio.Group')
              }}
            />
          </Form.Item>
        </Form.Item>
      )}
      {type === 'MultipleSelect' && show && (
        <Form.Item label={config?.showLabel ? label : ''} required={config?.required}>
          {
            config?.desc && <div className="question-desc">{config.desc}</div>
          }
          <Form.Item
            name={key}
            getValueFromEvent={(value) => {
              const newValue = value.length > config?.maxLength ? value.filter((checkItem: string) => {
                return mulSelectValue.indexOf(checkItem) !== -1
              }): value
              setMulSelectValue(newValue)
              formInstance.setFieldsValue({key: newValue})
              return newValue
            }}
          >
            <Select
              options={config?.options.map((optionItem: {label: string, value: string}, index: number) => {
                return {label: optionItem.label, value: `${optionItem.value}_${index}`}
              })}
              allowClear
              placeholder={config?.placeholder}
              mode="multiple"
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
      {type === 'DatePicker' && show && (
        <Form.Item label={config?.showLabel ? label : ''} required={config?.required}>
          {
            config?.desc && <div className="question-desc">{config.desc}</div>
          }
          <Form.Item name={key}>
            <DatePicker
              showTime={{
                format: config?.format
              }}
              placeholder={config?.placeholder}
              picker={config?.picker}
            />
          </Form.Item>
        </Form.Item>
      )}
      {type === 'Select' && show && (
        <Form.Item label={config?.showLabel ? label : ''} required={config?.required}>
          {
            config?.desc && <div className="question-desc">{config.desc}</div>
          }
          <Form.Item name={key}>
            <Select
              options={config?.options}
              allowClear
              placeholder={config?.placeholder}
            />
          </Form.Item>
        </Form.Item>
      )}
      {type === 'Cascader' && show && (
        <Form.Item label={config?.showLabel ? label : ''} required={config?.required}>
          {
            config?.desc && <div className="question-desc">{config.desc}</div>
          }
          <Form.Item name={key}>
            <Cascader
              fieldNames={{ label: 'name', value: 'code', children: 'nodes' }}
              options={config?.selectType === 'county' ? areaCodeOptions.countyOptions : areaCodeOptions.cityOptions}
              allowClear
            />
          </Form.Item>
        </Form.Item>
      )}
      {type === 'ImagePicker' && show && (
        <Form.Item label={config?.showLabel ? label : ''} required={config?.required}>
          {
            config?.desc && <div className="question-desc">{config.desc}</div>
          }
          <Form.Item name={key}>
            <Checkbox.Group style={{ width: '100%' }}>
              {
                config?.options.map((imgItem: {value: string}, index: number) => {
                  return (
                    <Checkbox key={index} value={imgItem.value}><img src={imgItem.value} alt='' /></Checkbox>
                  )
                })
              }
            </Checkbox.Group>
          </Form.Item>
        </Form.Item>
      )}
    </>
  )
}

export default GenerateFormItem
