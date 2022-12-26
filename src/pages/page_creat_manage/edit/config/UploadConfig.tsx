import React from 'react'
import { Form, Input, InputNumber, Radio, Select, Switch } from 'antd';
import { useConfig } from '../hooks/hooks'
import { paramsTypeOptions, uploadListTypeOptions } from '../utils/options';

const UploadConfig = () => {
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
      <Form.Item label="接受上传的文件类型文件后缀多个逗号隔开（.jpg,.jpeg,.png,.doc,.docx）">
        <Input value={selectWidgetItem?.config?.accept} onChange={(event) => handleChange(event.target.value || undefined, 'config.accept')} />
      </Form.Item>
      <Form.Item label="限制上传数量">
        <InputNumber min={0} value={selectWidgetItem?.config?.maxCount} onChange={(value) => handleChange(value || undefined, 'config.maxCount')} />
      </Form.Item>
      <Form.Item label="上传列表样式">
        <Radio.Group
          optionType="button"
          buttonStyle="solid"
          options={uploadListTypeOptions}
          value={selectWidgetItem?.config?.listType}
          onChange={(event) => handleChange(event.target.value, 'config.listType')}
        />
      </Form.Item>
      <Form.Item label="是否支持多选文件">
        <Switch defaultChecked={selectWidgetItem?.config?.multiple} onChange={(checked) => handleChange(checked, 'config.multiple')} />
      </Form.Item>
      <Form.Item label="是否展示文件列表">
        <Switch defaultChecked={selectWidgetItem?.config?.showUploadList} onChange={(checked) => handleChange(checked, 'config.showUploadList')} />
      </Form.Item>
    </>
  )
}

export default UploadConfig
