import React from 'react'
import { Form, Input, Select } from 'antd'
import { useConfig } from '../hooks/hooks'
import { buttonTypeOptions } from '../utils/options';

const ButtonConfig = () => {
  const { selectWidgetItem, handleChange } = useConfig()

  return (
    <>
      <Form.Item label="内容">
        <Input value={selectWidgetItem?.config?.children} onChange={(event) => handleChange(event.target.value, 'config.children')} />
      </Form.Item>
      <Form.Item label="按钮类型">
        <Select options={buttonTypeOptions} value={selectWidgetItem?.config?.type} onChange={(value) => handleChange(value, 'config.type')} />
      </Form.Item>
    </>
  )
}

export default ButtonConfig
