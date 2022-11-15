import React, { useState } from 'react';
import {
  Checkbox,
  Form, Input, InputNumber,
  Tooltip,
} from 'antd';
import { useConfig } from '../hooks/hooks'
const TextAreaConfig = () => {
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
              handleChange('多行文本', 'label')
              handleChange("多行文本", 'config.paramDesc')
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
      <Form.Item label="填写提示" >
        <Input
          value={selectWidgetItem?.config?.placeholder}
          maxLength={20}
          onChange={(event) => handleChange(event.target.value, 'config.placeholder')}
        />
      </Form.Item>
      <Form.Item label="限制条件" >
        <Form.Item>
          <Checkbox
            checked={selectWidgetItem?.config?.required}
            onChange={(e) => handleChange(e.target.checked, 'config.required')}
          >
            该项为必填项
          </Checkbox>
        </Form.Item>
        <Checkbox
          checked={showLengthInput}
          onChange={(e) => {
            setShowLengthInput(e.target.checked)
            if (!e.target.checked){
              handleChange(35, 'config.maxLength')
            }
          }}
        >
          自定义限制字数
          <Tooltip title="未勾选时，默认最多支持输入35字符">
            <img className="question-icon" src={require('../image/question_icon.png')} alt='' />
          </Tooltip>
        </Checkbox>
      </Form.Item>
      {
        showLengthInput &&
        <Form.Item label="最多可输入字符数" >
          <InputNumber
            value={selectWidgetItem?.config?.maxLength}
            maxLength={500}
            min={1}
            onChange={(event) => handleChange(event.target.value, 'config.maxLength')}
          />
        </Form.Item>
      }
    </>
  )
}

export default TextAreaConfig
