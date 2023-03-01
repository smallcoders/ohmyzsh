import { Checkbox, Form, Input, Select } from 'antd';
import { useConfig } from '../hooks/hooks'
import { provinceCascadeOption } from '../utils/options'

const CascaderConfig = () => {
  const { selectWidgetItem, handleChange } = useConfig()
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
              handleChange('地址', 'label')
              handleChange("地址", 'config.paramDesc')
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
      <Form.Item label="描述信息" >
        <Input.TextArea
          value={selectWidgetItem?.config?.desc}
          maxLength={50}
          onChange={(event) => handleChange(event.target.value, 'config.desc')}
        />
      </Form.Item>
      <Form.Item label="省市区/省市">
        <Select
          options={provinceCascadeOption}
          value={selectWidgetItem?.config?.selectType}
          onChange={(value) => handleChange(value, 'config.selectType')}
        />
      </Form.Item>
      <Form.Item label="限制条件" >
        <Checkbox
          checked={selectWidgetItem?.config?.required}
          onChange={(e) => handleChange(e.target.checked, 'config.required')}
        >
          该项为必填项
        </Checkbox>
      </Form.Item>
    </>
  )
}

export default CascaderConfig
