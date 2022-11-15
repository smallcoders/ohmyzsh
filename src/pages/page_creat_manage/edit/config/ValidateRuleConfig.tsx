import React, { FC } from 'react'
import { Form, Radio, Switch, Select } from 'antd'
import { useConfig } from '../hooks/hooks'
import {
  validateTriggerOptions,
  regOptions
} from '../utils/options';

const ValidateRuleConfig: FC = () => {
  const { selectWidgetItem, handleChange } = useConfig()

  return (
    <>
      <h4>验证规则</h4>
      {
        ['Input', 'TextArea'].indexOf(selectWidgetItem?.type || '') !== -1 &&
        <Form.Item label="触发时机">
          <Radio.Group
            optionType="button"
            buttonStyle="solid"
            value={selectWidgetItem?.formItemConfig?.rules[0].validateTrigger}
            options={validateTriggerOptions}
            onChange={(event) => handleChange(event.target.value, 'formItemConfig.rules[0].validateTrigger')}
          />
        </Form.Item>
      }
      <Form.Item label="是否为必选字段">
        <Switch defaultChecked={selectWidgetItem?.formItemConfig?.rules[0].required} onChange={(checked) => handleChange(checked, 'formItemConfig.rules[0].required')} />
      </Form.Item>
      {
        selectWidgetItem?.type === 'Input' &&
        <Form.Item label="正则表达式">
          <Select options={regOptions} value={selectWidgetItem?.formItemConfig?.rules[0].pattern} onChange={(value) => handleChange(value, 'formItemConfig.rules[0].pattern')} />
        </Form.Item>
      }
    </>
  )
}

export default ValidateRuleConfig
