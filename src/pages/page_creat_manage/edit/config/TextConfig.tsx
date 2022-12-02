import React from 'react'
import { Form, Input, InputNumber, Radio, Switch } from 'antd';
import { useConfig } from '../hooks/hooks'
import { textAlignOptions } from '../utils/options';

const TextConfig = () => {
  const { selectWidgetItem, handleChange } = useConfig()
  return (
    <>
      <Form.Item label="内容">
        <Input value={selectWidgetItem?.config?.children} onChange={(event) => handleChange(event.target.value, 'config.children')} />
      </Form.Item>
      <Form.Item label="触发时机">
        <Radio.Group
          optionType="button"
          buttonStyle="solid"
          value={selectWidgetItem?.config?.textAlign}
          options={textAlignOptions}
          onChange={(event) => handleChange(event.target.value, 'config.textAlign')}
        />
      </Form.Item>
      <Form.Item label="字体大小">
        <InputNumber value={selectWidgetItem?.config?.fontSize} onChange={(value) => handleChange(value, 'config.fontSize')} />
      </Form.Item>
      <Form.Item label="是否加粗">
        <Switch defaultChecked={selectWidgetItem?.config?.strong} onChange={(checked) => handleChange(checked, 'config.strong')} />
      </Form.Item>
      <Form.Item label="是否斜体">
        <Switch defaultChecked={selectWidgetItem?.config?.italic} onChange={(checked) => handleChange(checked, 'config.italic')} />
      </Form.Item>
      <Form.Item label="添加下划线样式">
        <Switch defaultChecked={selectWidgetItem?.config?.underline} onChange={(checked) => handleChange(checked, 'config.underline')} />
      </Form.Item>
    </>
  )
}

export default TextConfig
