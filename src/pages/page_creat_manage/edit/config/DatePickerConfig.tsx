import { useContext } from 'react';
import { Checkbox, Form, Input, Select } from 'antd';
import { useConfig } from '../hooks/hooks'
import { dateTypeOptions } from '../utils/options';
import { DesignContext } from '@/pages/page_creat_manage/edit/store';

const DatePickerConfig = () => {
  const { selectWidgetItem, handleChange } = useConfig()
  const { state } = useContext(DesignContext)
  const { widgetFormList } = state
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
      <Form.Item
        required
        label="参数名"
        tooltip="此项用于统计数据时定义字段，只允许输入大小写字母、下划线及数字"
      >
        {selectWidgetItem?.errorMsg && <div className="config-error-msg">{selectWidgetItem.errorMsg}</div>}
        <Input
          value={selectWidgetItem?.config?.paramKey}
          onBlur={(e) => {
            if(!e.target.value){
              handleChange('参数名不得为空', 'errorMsg')
              return
            } else if(/[^\w]/g.test(e.target.value)){
              handleChange('只允许输入大小写字母、下划线及数字', 'errorMsg')
              return
            }else {
              const repeatParam = widgetFormList.filter((item: any) => {
                return item.key !== selectWidgetItem!.key && item.config.paramKey === selectWidgetItem!.config!.paramKey
              })
              if (repeatParam.length){
                handleChange('此参数名已存在，请更换', 'errorMsg')
              } else {
                handleChange('', 'errorMsg')
              }
            }
          }}
          onChange={(event) => {
            handleChange(event.target.value, 'config.paramKey')
          }}
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
      {/*<Form.Item label="默认日期">*/}
      {/*  <DatePicker*/}
      {/*    {...(selectWidgetItem?.config)}*/}
      {/*    placeholder="请选择默认日期"*/}
      {/*    value={selectWidgetItem?.formItemConfig?.initialValue && moment(selectWidgetItem.formItemConfig.initialValue)}*/}
      {/*    onChange={(_, dateString) => handleChange(dateString, 'formItemConfig.initialValue')}*/}
      {/*  />*/}
      {/*</Form.Item>*/}
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
