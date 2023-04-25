import { Checkbox, Form, Input, Select } from 'antd';
import { useConfig } from '../hooks/hooks'
import { dateTypeOptions } from '../utils/options';

const DatePickerConfig = () => {
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
              handleChange('日期时间', 'label')
              handleChange("日期时间", 'config.paramDesc')
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
      <Form.Item label="填写提示" >
        <Input
          value={selectWidgetItem?.config?.placeholder}
          maxLength={20}
          onChange={(event) => handleChange(event.target.value, 'config.placeholder')}
        />
      </Form.Item>
      <Form.Item label="日期选择类型">
        <Select options={dateTypeOptions} value={selectWidgetItem?.config?.format} onChange={(value) => {
          if (value === 'YYYY-MM'){
            handleChange('month', 'config.picker')
          } else if (value === 'YYYY'){
            handleChange('year', 'config.picker')
          }else {
            handleChange('date', 'config.picker')
          }
          if (['YYYY-MM', 'YYYY-MM-DD', 'YYYY'].indexOf(value) !== -1){
            handleChange(false, 'config.showTime')
          } else {
            handleChange(true, 'config.showTime')
          }
          handleChange(value, 'config.format')
        }} />
      </Form.Item>
    </>
  )
}

export default DatePickerConfig
