import React from 'react'
import {
  Form, Input, Select, Switch,
  // Radio,
  // Space,
  // Switch
} from 'antd';
import { useConfig } from '../hooks'
import OptionSourceTypeConfig from '../config/OptionSourceTypeConfig'
import { paramsTypeOptions } from '@/pages/form_creat/utils/options';
// import {
//   radioGroupButtonStyleOptions,
//   radioGroupOptionTypeOptions,
//   sizeOptions
// } from '../utils/options'

const RadioGroupConfig = () => {
  const { selectWidgetItem, handleChange } = useConfig()

  return (
    <>
      <Form.Item label="标题">
        <Input value={selectWidgetItem?.label} onChange={(event) => handleChange(event.target.value, 'label')} />
      </Form.Item>
      <Form.Item label="是否作为参数提交">
        <Switch defaultChecked={selectWidgetItem?.config?.is_params} onChange={(checked) => handleChange(checked, 'config.is_params')} />
      </Form.Item>
      {
        selectWidgetItem?.config?.is_params &&
        <>
          <Form.Item label="参数名">
            <Input value={selectWidgetItem?.config?.params_key} onChange={(event) => handleChange(event.target.value, 'config.params_key')} />
          </Form.Item>
          <Form.Item label="参数描述">
            <Input value={selectWidgetItem?.config?.params_desc} onChange={(event) => handleChange(event.target.value, 'config.params_desc')} />
          </Form.Item>
          <Form.Item label="参数类型">
            <Select options={paramsTypeOptions} value={selectWidgetItem?.config?.params_type} onChange={(value) => handleChange(value, 'config.params_type')} />
          </Form.Item>
        </>
      }
      {/*<Form.Item label="RadioOptions类型">*/}
      {/*  <Radio.Group*/}
      {/*    buttonStyle="solid"*/}
      {/*    optionType="button"*/}
      {/*    options={radioGroupOptionTypeOptions}*/}
      {/*    value={selectWidgetItem?.config?.optionType}*/}
      {/*    onChange={(event) => handleChange(event.target.value, 'config.optionType')}*/}
      {/*  />*/}
      {/*</Form.Item>*/}

      {/*<Form.Item label="RadioButton样式">*/}
      {/*  <Radio.Group*/}
      {/*    buttonStyle="solid"*/}
      {/*    optionType="button"*/}
      {/*    options={radioGroupButtonStyleOptions}*/}
      {/*    value={selectWidgetItem?.config?.buttonStyle}*/}
      {/*    onChange={(event) => handleChange(event.target.value, 'config.buttonStyle')}*/}
      {/*  />*/}
      {/*</Form.Item>*/}

      {/*<Form.Item*/}
      {/*  label={*/}
      {/*    <Space>*/}
      {/*      大小*/}
      {/*      {selectWidgetItem?.config?.size && (*/}
      {/*        <a*/}
      {/*          href="/#"*/}
      {/*          onClick={(event) => {*/}
      {/*            event.preventDefault()*/}
      {/*            handleChange(undefined, 'config.size')*/}
      {/*          }}*/}
      {/*        >*/}
      {/*          还原*/}
      {/*        </a>*/}
      {/*      )}*/}
      {/*    </Space>*/}
      {/*  }*/}
      {/*>*/}
      {/*  <Radio.Group*/}
      {/*    optionType="button"*/}
      {/*    buttonStyle="solid"*/}
      {/*    options={sizeOptions}*/}
      {/*    value={selectWidgetItem?.config?.size}*/}
      {/*    onChange={(event) => handleChange(event.target.value, 'config.size')}*/}
      {/*  />*/}
      {/*</Form.Item>*/}

      <OptionSourceTypeConfig />

      {/*<Form.Item label="是否隐藏">*/}
      {/*  <Switch defaultChecked={selectWidgetItem?.config?.hidden} onChange={(checked) => handleChange(checked, 'config.hidden')} />*/}
      {/*</Form.Item>*/}

      {/*<Form.Item label="是否禁用">*/}
      {/*  <Switch defaultChecked={selectWidgetItem?.config?.disabled} onChange={(checked) => handleChange(checked, 'config.disabled')} />*/}
      {/*</Form.Item>*/}
    </>
  )
}

export default RadioGroupConfig
