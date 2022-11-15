import React, { useState } from 'react';
import { Checkbox, Form, Input, InputNumber, Select } from 'antd';
import { useConfig } from '../hooks/hooks'
import OptionSourceTypeConfig from '../config/OptionSourceTypeConfig'

const CheckboxGroupConfig = () => {
  const { selectWidgetItem, handleChange } = useConfig()
  const [showLengthInput, setShowLengthInput] = useState<boolean>(false)
  return (
    <>
      <Form.Item required label="标题">
        <Input
          maxLength={35}
          value={selectWidgetItem?.label}
          onChange={(event) => {
            handleChange(event.target.value, 'label')
            handleChange(event.target.value, 'config.paramDesc')
          }}
          onBlur={(e) => {
            if(!e.target.value){
              handleChange('多选按钮组', 'label')
              handleChange("多选按钮组", 'config.paramDesc')
            }
          }}
        />
        <Checkbox
          checked={selectWidgetItem?.config?.showLabel}
          onChange={(e) => handleChange(e.target.checked, 'config.showLabel')}
        >
          显示标题
        </Checkbox>
      </Form.Item>
      <Form.Item required label="参数名" tooltip="此项用于统计数据时定义字段，只允许输入大小写字母、下划线及数字">
        <Input
          value={selectWidgetItem?.config?.paramKey}
          onChange={(event) => handleChange(event.target.value, 'config.paramKey')}
        />
      </Form.Item>
      <Form.Item label="描述信息" >
        <Input.TextArea
          value={selectWidgetItem?.config?.desc}
          maxLength={50}
          onChange={(event) => handleChange(event.target.value, 'config.desc')}
        />
      </Form.Item>
      <OptionSourceTypeConfig multiple />
      <Form.Item label="默认选择">
        <Select
          mode="multiple"
          options={selectWidgetItem?.config?.options}
          value={selectWidgetItem?.config?.defaultValue}
          onChange={(option) => handleChange(option, 'config.defaultValue')}
        />
      </Form.Item>
      <Form.Item label="限制条件" >
        <Checkbox
          checked={selectWidgetItem?.config?.required}
          onChange={(e) => handleChange(e.target.checked, 'config.required')}
        >
          该项为必填项
        </Checkbox>
        <Form.Item >
          <Checkbox
            checked={showLengthInput}
            onChange={(e) => {
              setShowLengthInput(e.target.checked)
              if (!e.target.checked){
                handleChange(selectWidgetItem?.config?.options.length, 'config.maxLength')
              }
            }}
          >
            最多选择几项
          </Checkbox>
          {
            showLengthInput &&
            <InputNumber
              max={selectWidgetItem?.config?.options.length}
              min={2}
              value={selectWidgetItem?.config?.maxLength}
              onChange={(value) => handleChange(value, 'config.maxLength')}
            />
          }
        </Form.Item>
      </Form.Item>
    </>
  )
}
export default CheckboxGroupConfig
