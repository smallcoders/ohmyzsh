import React from 'react'
import { Form, Input, Radio, Select, Space } from 'antd'
import { useConfig } from '../hooks'
import { buttonShapeOptions, buttonTypeOptions, htmlButtonTypeOptions, sizeOptions, postMethodOptions } from '../utils/options'

const ButtonConfig = () => {
  const { selectWidgetItem, handleChange } = useConfig()

  return (
    <>
      <Form.Item label="内容">
        <Input value={selectWidgetItem?.config?.children} onChange={(event) => handleChange(event.target.value, 'config.children')} />
      </Form.Item>

      {/*<Form.Item label="跳转地址">*/}
      {/*  <Input*/}
      {/*    value={selectWidgetItem?.config?.href}*/}
      {/*    placeholder="点击跳转的地址，指定此属性 button 的行为和 a 链接一致"*/}
      {/*    onChange={(event) => handleChange(event.target.value, 'config.href')}*/}
      {/*  />*/}
      {/*</Form.Item>*/}

      {/*{selectWidgetItem?.config?.href && (*/}
      {/*  <Form.Item label="Target">*/}
      {/*    <Input*/}
      {/*      value={selectWidgetItem?.config?.target}*/}
      {/*      placeholder="相当于 a 链接的 target 属性，href 存在时生效"*/}
      {/*      onChange={(event) => handleChange(event.target.value, 'config.target')}*/}
      {/*    />*/}
      {/*  </Form.Item>*/}
      {/*)}*/}
      {/*<Form.Item label="接口链接">*/}
      {/*  <Input*/}
      {/*    value={selectWidgetItem?.config?.target}*/}
      {/*    placeholder="提交接口"*/}
      {/*    onChange={(event) => handleChange(event.target.value, 'config.target')}*/}
      {/*  />*/}
      {/*</Form.Item>*/}
      {/*<Form.Item label="接口方式">*/}
      {/*  <Select options={postMethodOptions} value={selectWidgetItem?.config?.type} onChange={(value) => handleChange(value, 'config.type')} />*/}
      {/*</Form.Item>*/}
      {/*<Form.Item label="按钮类型">*/}
      {/*  <Select options={buttonTypeOptions} value={selectWidgetItem?.config?.type} onChange={(value) => handleChange(value, 'config.type')} />*/}
      {/*</Form.Item>*/}

      {/*<Form.Item*/}
      {/*  label={*/}
      {/*    <Space>*/}
      {/*      按钮大小*/}
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

      {/*<Form.Item label="按钮形状">*/}
      {/*  <Radio.Group*/}
      {/*    optionType="button"*/}
      {/*    buttonStyle="solid"*/}
      {/*    options={buttonShapeOptions}*/}
      {/*    value={selectWidgetItem?.config?.shape}*/}
      {/*    onChange={(event) => handleChange(event.target.value, 'config.shape')}*/}
      {/*  />*/}
      {/*</Form.Item>*/}
      {/*<Form.Item label="HtmlType">*/}
      {/*  <Radio.Group*/}
      {/*    optionType="button"*/}
      {/*    buttonStyle="solid"*/}
      {/*    options={htmlButtonTypeOptions}*/}
      {/*    value={selectWidgetItem?.config?.htmlType}*/}
      {/*    onChange={(event) => handleChange(event.target.value, 'config.htmlType')}*/}
      {/*  />*/}
      {/*</Form.Item>*/}
    </>
  )
}

export default ButtonConfig
