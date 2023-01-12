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
    item: { type, config, label, key, hide },
    formInstance,
    areaCodeOptions,
    clickCallBack,
    widgetInfo: {widgetFormList}
  } = props

  const [checkBoxValue, setCheckBoxValue] = useState<string[]>(config?.defaultValue || [])
  const [mulSelectValue, setMulSelectValue] = useState<string[]>(config?.defaultValue || [])
  const [imageSelectValue, setImageSelectValue] = useState<string[]>([])

  const getList = (currentValues: any, showArr: string[], controlArr: string[], widgetFormArr: any) => {
    let showList: string[] = showArr
    // 获取所有被控制组件
    let controlAllList: string[] = controlArr
    widgetFormArr.forEach((item: any) => {
      if (['RadioGroup', 'CheckboxGroup', 'MultipleSelect', 'Select', 'ImagePicker'].indexOf(item.type) !== -1){
        const isHide = showList?.indexOf(item.key!) !== -1 ? false : controlAllList?.indexOf(item.key!) !== -1 ? true : item.hide
        if ((currentValues[item.key] && !isHide) || (!isHide && (currentValues[item.key] || item.config.defaultValue)) ) {
          const currentValue = currentValues[item.key] || item.config.defaultValue
          item.config.options.forEach((optionItem: {value: string, showList: string[]}) => {
            if (currentValue instanceof Array &&
              currentValue.indexOf(optionItem.value) !== -1
            ){
              showList = [...new Set([...showList, ...(optionItem.showList || [])])]
            }
            if (typeof currentValue === 'string' && currentValue === optionItem.value){
              showList = [...new Set([...showList, ...(optionItem.showList || [])])]
            }
          })
        }
      }
      controlAllList = [...new Set([...controlAllList, ...(item.controlList || [])])]
    })
    return {showList, controlAllList}
  }

  const handleShowList = (value: string | string[]) => {
    // 获取当前表单所有输入值
    const currentValues = formInstance.getFieldsValue();
    currentValues[key!] = value

    // 获取当前需要显示的所有隐藏组件
    let showList: string[] = []

    // 获取所有被控制组件
    let controlAllList: string[] = []
    let listObject = getList(currentValues, showList, controlAllList, widgetFormList)
    while (listObject.showList.length !== showList.length){
      showList = listObject.showList
      controlAllList = listObject.controlAllList
      listObject = getList(currentValues, showList, controlAllList, widgetFormList)
    }
    showList = listObject.showList
    controlAllList = listObject.controlAllList
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
  useEffect(() => {
    if (config?.defaultValue && !hide){
      formInstance.setFieldsValue({
        [key!]: config.defaultValue
      })
    }
  }, [hide])
  return (
    <>
      {type === 'CheckboxGroup' && !hide && (
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
      {type === 'Input' && !hide && (
        <Form.Item
          label={config?.showLabel ? label : ''}
          required={config?.required}
        >
          {
            config?.desc && <div className="question-desc">{config.desc}</div>
          }
          <Form.Item
            name={key}
            validateTrigger="onBlur"
            getValueFromEvent={(e) => {
              let newValue = e.target.value
              if (newValue && config?.regInfo?.reg){
                newValue = newValue?.replace(/[^\d+]/g, '')
                formInstance.setFieldsValue({key: newValue})
              }
              return newValue
            }}
            rules={
                [{
                  validator: (_, value) => {
                    if (config?.required && !value){
                      return Promise.reject(new Error('请输入内容'))
                    }
                    if (config?.regInfo?.reg && value){
                      const reg = new RegExp(config?.regInfo?.reg)
                      const validResult = reg.test(value)
                      if (!validResult){
                        return Promise.reject(new Error(config?.regInfo?.errorMsg))
                      }
                      return Promise.resolve()
                    }
                    return Promise.resolve()
                  }
                }]
            }
          >
            <Input
              allowClear={config?.allowClear}
              maxLength={config?.regInfo?.maxLength || config?.maxLength}
              placeholder={config?.placeholder}
            />
          </Form.Item>
        </Form.Item>
      )}
      {type === 'TextArea' && !hide && (
        <Form.Item
          label={config?.showLabel ? label : ''}
          required={config?.required}
        >
          {
            config?.desc && <div className="question-desc">{config.desc}</div>
          }
          <Form.Item
            name={key}
            validateTrigger="onBlur"
            getValueFromEvent={(e) => {
              let newValue = e.target.value
              if (newValue && config?.regInfo?.reg){
                newValue = newValue?.replace(/[^\d+]/g, '')
                formInstance.setFieldsValue({key: newValue})
              }
              return newValue
            }}
            rules={
              [{
                validator: (_, value) => {
                  if (config?.required && !value){
                    return Promise.reject(new Error('请输入内容'))
                  }
                  if (config?.regInfo?.reg && value){
                    const reg = new RegExp(config?.regInfo?.reg)
                    const validResult = reg.test(value)
                    if (!validResult){
                      return Promise.reject(new Error(config?.regInfo?.errorMsg))
                    }
                    return Promise.resolve()
                  }
                  return Promise.resolve()
                }
              }]
            }
          >
            <Input.TextArea
              rows={4}
              maxLength={config?.regInfo?.maxLength || config?.maxLength}
              placeholder={config?.placeholder}
            />
          </Form.Item>
        </Form.Item>
      )}
      {type === 'RadioGroup' && !hide && (
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
      {type === 'MultipleSelect' && !hide && (
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
              options={config?.options}
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
      {type === 'DatePicker' && !hide && (
        <Form.Item label={config?.showLabel ? label : ''} required={config?.required}>
          {
            config?.desc && <div className="question-desc">{config.desc}</div>
          }
          <Form.Item
            name={key}
            rules={config?.required ? [{ required: true, message: '请选择日期'}] : []}
          >
            <DatePicker
              showTime={config?.showTime}
              format={config?.format}
              placeholder={config?.placeholder}
              picker={config?.picker}
            />
          </Form.Item>
        </Form.Item>
      )}
      {type === 'Select' && !hide && (
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
      {type === 'Cascader' && !hide && (
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
      {type === 'ImagePicker' && !hide && (
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
