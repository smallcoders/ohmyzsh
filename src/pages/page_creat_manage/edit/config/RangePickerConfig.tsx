import React from 'react'
import { DatePicker, Form, Input, Select, Switch } from 'antd';
import moment from 'moment'
import { useConfig } from '../hooks/hooks'
import { dateTypeOptions, paramsTypeOptions } from '../utils/options';

const RangePickerConfig = () => {
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
      <Form.Item label="Placeholder (使用“-”分割)">
        <Input
          placeholder="输入框提示文字"
          value={selectWidgetItem?.config?.placeholder && selectWidgetItem?.config?.placeholder.join('-')}
          onChange={(event) => handleChange(event.target.value ? event.target.value.split('-') : undefined, 'config.placeholder')}
        />
      </Form.Item>
      <Form.Item label="默认日期">
        <DatePicker.RangePicker
          {...(selectWidgetItem?.config)}
          value={
            selectWidgetItem?.formItemConfig?.initialValue?.length === 2
              ? [moment(selectWidgetItem.formItemConfig.initialValue[0]), moment(selectWidgetItem.formItemConfig.initialValue[1])]
              : undefined
          }
          onChange={(_, dateStrings) =>
            handleChange(
              dateStrings.filter((dateString) => dateString),
              'formItemConfig.initialValue'
            )
          }
        />
      </Form.Item>
      <Form.Item label="日期选择类型">
        <Select options={dateTypeOptions} value={selectWidgetItem?.config?.format} onChange={(value) => {
          if (value === 'YYYY-MM'){
            handleChange('month', 'config.picker')
          } else {
            handleChange('date', 'config.picker')
          }
          if (['YYYY-MM', 'YYYY-MM-DD'].indexOf(value) !== -1){
            handleChange(false, 'config.showTime')
          } else {
            handleChange(true, 'config.showTime')
          }
          handleChange(value, 'config.format')
        }} />
      </Form.Item>
    </>
  )
}

export default RangePickerConfig
