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
  widgetInfo: any
  areaCodeOptions: {
    county: any[],
    city: any[],
    province: any[]
  }
  clickCallBack: (showList: string[], controlList: string[]) => void
}

const GenerateFormItem = (props: Props) => {
  const {
    item: { type, config, label, key, show },
    formInstance,
    areaCodeOptions,
    clickCallBack,
    widgetInfo: {widgetFormList}
  } = props
  const handleShowList = (value: string | string[]) => {
    // 获取当前表单所有输入值
    const currentValues = formInstance.getFieldsValue();
    currentValues[key!] = value

    // 获取当前需要显示的所有隐藏组件
    let showList: string[] = []

    // 获取所有被控制组件
    let controlAllList: string[] = []
    widgetFormList.forEach((item: any) => {
      if(currentValues[item.key] &&
        ['RadioGroup', 'CheckboxGroup', 'MultipleSelect', 'Select', 'ImagePicker'].indexOf(item.type) !== -1)
      {
        item.config.options.forEach((optionItem: {value: string, showList: string[]}) => {
          if (currentValues[item.key] instanceof Array &&
            currentValues[item.key].indexOf(optionItem.value) !== -1
          ){
            showList = [...new Set([...showList, ...(optionItem.showList || [])])]
          }
          if (typeof currentValues[item.key] === 'string' && currentValues[item.key] === optionItem.value){
            showList = [...new Set([...showList, ...(optionItem.showList || [])])]
          }
        })
      }
      controlAllList = [...new Set([...controlAllList, ...(item.controlList || [])])]
    })
    if (clickCallBack){
      clickCallBack(showList, controlAllList || [])
    }
  }
  useEffect(() => {
    if (config?.defaultValue){
      formInstance.setFieldsValue({
        [key!]: config.defaultValue
      })
    }
  }, [config?.defaultValue])

  const [checkBoxValue, setCheckBoxValue] = useState<string[]>(config?.defaultValue || [])
  const [mulSelectValue, setMulSelectValue] = useState<string[]>(config?.defaultValue || [])
  const [imageSelectValue, setImageSelectValue] = useState<string[]>([])
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
              handleShowList(newValue)
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
              onChange={(e) => {
                handleShowList(e.target.value)
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
            rules={config?.required ? [{ required: true, message: '请选择'}] : []}
            getValueFromEvent={(value) => {
              const newValue = value.length > config?.maxLength ? value.filter((checkItem: string) => {
                return mulSelectValue.indexOf(checkItem) !== -1
              }): value
              formInstance.setFieldsValue({key: newValue})

              handleShowList(newValue)

              setMulSelectValue(newValue)

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
          <Form.Item
            name={key}
            rules={config?.required ? [{ required: true, message: '请选择日期'}] : []}
          >
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
          <Form.Item
            name={key}
            rules={config?.required ? [{ required: true, message: '请选择'}] : []}
          >
            <Select
              options={config?.options}
              allowClear
              placeholder={config?.placeholder}
              onChange={(value) => {
                handleShowList(value)
              }}
            />
          </Form.Item>
        </Form.Item>
      )}
      {type === 'Cascader' && show && (
        <Form.Item label={config?.showLabel ? label : ''} required={config?.required}>
          {
            config?.desc && <div className="question-desc">{config.desc}</div>
          }
          <Form.Item
            name={key}
            rules={config?.required ? [{ required: true, message: '请选择'}] : []}
          >
            <Cascader
              fieldNames={{ label: 'name', value: 'code', children: 'nodes' }}
              options={config?.selectType === 'detailAddress' ? areaCodeOptions.county : areaCodeOptions[config?.selectType || 'county']}
              allowClear
            />
          </Form.Item>
          {
            config?.selectType === 'detailAddress' &&
            <Form.Item
              name={`${key}_detailAddress`}
              rules={config?.required ? [{ required: true, message: '请填写'}] : []}
            >
              <Input.TextArea
                rows={4}
                maxLength={200}
                showCount
                placeholder='请填写详细地址'
              />
            </Form.Item>
          }
        </Form.Item>
      )}
      {type === 'ImagePicker' && (
        <Form.Item label={config?.showLabel ? label : ''} required={config?.required}>
          {
            config?.desc && <div className="question-desc">{config.desc}</div>
          }
          <Form.Item
            name={key}
            rules={config?.required ? [{ required: true, message: '请选择'}] : []}
            getValueFromEvent={(value) => {
              const newValue = value.length > config?.maxLength ? value.filter((checkItem: string) => {
                return imageSelectValue.indexOf(checkItem) !== -1
              }): value
              setImageSelectValue(newValue)
              formInstance.setFieldsValue({key: newValue})
              handleShowList(newValue)
              return newValue
            }}
          >
            <Checkbox.Group
              className="image-picker"
              onChange={(value)=>{
                if (value.length > config?.maxLength){
                  Modal.info({
                    title: '提示',
                    content: `此题最多只能选择${config?.maxLength}项`,
                    okText: '我知道了',
                  });
                }
              }}
            >
              {
                config?.options.map((imgItem: {value: string, label: string}, index: number) => {
                  return (
                    <Checkbox key={index} value={imgItem.value}>
                      {
                        imgItem.value ? <div className="no-img"><img className="img" src={imgItem.value} alt='' /></div>
                          : <div className="no-img" />
                      }
                      <div className="img-picker-label">{imgItem.label}</div>
                    </Checkbox>
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
