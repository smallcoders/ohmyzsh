import React from 'react'
import { Form, Input, InputNumber, Select, Switch } from 'antd';
import { useConfig } from '../hooks/hooks'
import { paramsTypeOptions } from '../utils/options';

const InputNumberConfig = () => {
  const { selectWidgetItem, handleChange } = useConfig()
  return (
    <>
      <Form.Item label="标题是否显示">
        <Switch defaultChecked={selectWidgetItem?.config?.showLabel} onChange={(checked) => {
          handleChange(checked, 'config.showLabel')
          handleChange(checked ? selectWidgetItem?.config?.paramDesc : '', 'label')
        }} />
      </Form.Item>
      {
        selectWidgetItem?.config?.showLabel &&
        <Form.Item label="标题">
          <Input value={selectWidgetItem?.label} onChange={(event) => {
            handleChange(event.target.value, 'label')
            handleChange(event.target.value, 'config.paramDesc')
          }} />
        </Form.Item>
      }
      <Form.Item label="是否作为参数提交">
        <Switch defaultChecked={selectWidgetItem?.config?.isParam} onChange={(checked) => handleChange(checked, 'config.is_params')} />
      </Form.Item>
      {
        selectWidgetItem?.config?.isParam &&
        <>
          <Form.Item label="参数名">
            <Input value={selectWidgetItem?.config?.paramKey} onChange={(event) => handleChange(event.target.value, 'config.paramKey')} />
          </Form.Item>
          <Form.Item label="参数描述">
            <Input value={selectWidgetItem?.config?.paramDesc} onChange={(event) => handleChange(event.target.value, 'config.paramDesc')} />
          </Form.Item>
          <Form.Item label="参数类型">
            <Select options={paramsTypeOptions} value={selectWidgetItem?.config?.paramType} onChange={(value) => handleChange(value, 'config.paramType')} />
          </Form.Item>
        </>
      }
      <Form.Item label="默认值">
        <InputNumber value={selectWidgetItem?.formItemConfig?.initialValue} onChange={(value) => handleChange(value, 'formItemConfig.initialValue')} />
      </Form.Item>
      <Form.Item label="步长">
        <InputNumber value={selectWidgetItem?.config?.step} onChange={(value) => handleChange(value, 'config.step')} />
      </Form.Item>
      <Form.Item label="最大值">
        <InputNumber value={selectWidgetItem?.config?.max} onChange={(value) => handleChange(value, 'config.max')} />
      </Form.Item>
      <Form.Item label="最小值">
        <InputNumber value={selectWidgetItem?.config?.min} onChange={(value) => handleChange(value, 'config.min')} />
      </Form.Item>
      <Form.Item label="是否显示增减按钮">
        <Switch defaultChecked={selectWidgetItem?.config?.controls} onChange={(checked) => handleChange(checked, 'config.controls')} />
      </Form.Item>
    </>
  )
}

export default InputNumberConfig
