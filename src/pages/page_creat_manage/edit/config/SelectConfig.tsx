import React from 'react'
import { Form, Input,
  Radio, Select, Space, Switch } from 'antd';
import { useConfig } from '../hooks/hooks'
import OptionSourceTypeConfig from '../config/OptionSourceTypeConfig'
import { paramsTypeOptions, selectModeOptions,
} from '../utils/options';

const SelectConfig = () => {
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
      <Form.Item label="Placeholder">
        <Input value={selectWidgetItem?.config?.placeholder} onChange={(event) => handleChange(event.target.value, 'config.placeholder')} />
      </Form.Item>
      <Form.Item
        label={
          <Space>
            SelectMode
            {selectWidgetItem?.config?.mode && (
              <a
                href="/#"
                onClick={(event) => {
                  event.preventDefault()
                  handleChange('', 'formItemConfig.initialValue')
                  handleChange('string', 'formItemConfig.rules[0].type')
                  handleChange(undefined, 'config.mode')
                }}
              >
                还原
              </a>
            )}
          </Space>
        }
      >
        <Radio.Group
          optionType="button"
          buttonStyle="solid"
          options={selectModeOptions}
          value={selectWidgetItem?.config?.mode}
          onChange={(event) => {
            handleChange([], 'formItemConfig.initialValue')
            handleChange('array', 'formItemConfig.rules[0].type')
            handleChange(event.target.value, 'config.mode')
          }}
        />
      </Form.Item>
      <OptionSourceTypeConfig multiple={selectWidgetItem?.config?.mode} />
    </>
  )
}

export default SelectConfig
