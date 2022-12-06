import { useState, useContext } from 'react';
import { Button, Checkbox, Form, Input, InputNumber, message, Select } from 'antd';
import { useConfig } from '../hooks/hooks'
import { DesignContext } from '@/pages/page_creat_manage/edit/store';
import { clone } from 'lodash-es';
import UploadForm from '@/components/upload_form';

const ImagePickerConfig = () => {
  const { selectWidgetItem, handleChange } = useConfig()
  const { state } = useContext(DesignContext)
  const { widgetFormList } = state
  const [showLengthInput, setShowLengthInput] = useState<boolean>(false)
  // todo 默认图
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
              handleChange('图片选择', 'label')
              handleChange("图片选择", 'config.paramDesc')
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
      <Form.Item label="选项">
        <ul>
          {selectWidgetItem?.config?.options?.map((option: { label: string, value: string, index: number }, id: number) => (
            <li key={`${option.index}`}>
              <div className="option-item">
                <UploadForm
                  listType="picture-card"
                  className="avatar-uploader"
                  maxSize={1}
                  action={'/antelope-common/common/file/upload/record'}
                  showUploadList={false}
                  accept=".bmp,.gif,.png,.jpeg,.jpg"
                  value={option?.value}
                  onChange={(value: any) => {
                    const configOptions = clone(selectWidgetItem!.config!.options)
                    configOptions[id].value = value?.path || value
                    handleChange(configOptions, 'config.options')
                  }}
                />
                <Button
                  type="ghost"
                  shape="circle"
                  size="small"
                  onClick={() => {
                    if (selectWidgetItem?.config?.options.length <= 2){
                      message.warn('请至少保留两个选项', 2)
                      return
                    }
                    const configOptions = clone(selectWidgetItem!.config!.options)
                    const findIndex = selectWidgetItem?.config?.defaultValue?.indexOf(configOptions[id].value)
                    if(findIndex !== -1){
                      const defaultValue = clone(selectWidgetItem!.config!.defaultValue)
                      defaultValue.splice(findIndex, 1)
                      handleChange(defaultValue, 'config.defaultValue')
                    }
                    configOptions.splice(id, 1)
                    if(configOptions.length < selectWidgetItem?.config?.maxLength){
                      handleChange(configOptions.length, 'config.maxLength')
                    }
                    handleChange(configOptions, 'config.options')
                  }}
                >
                  —
                </Button>
              </div>
            </li>
          ))}
        </ul>
        <Button
          className="insert-btn"
          type="link"
          size="small"
          onClick={() => {
            const configOptions = clone(selectWidgetItem!.config!.options)
            const len = configOptions.length;
            const indexList: number[] = configOptions.map((item: {label: string, value: string, index: number}) => {
              return Number(item.label.replace('图片', '')) || item.index
            })
            const max = Math.max(...indexList)
            const label = `图片${max + 1}`
            configOptions.push({ label: label, value: label, index: max + 1 })
            handleChange(configOptions, 'config.options')
            if (len === selectWidgetItem!.config!.maxLength){
              handleChange(configOptions.length, 'config.maxLength')
            }
            handleChange(configOptions, 'config.options')
          }}
        >
          添加选项
        </Button>
      </Form.Item>
      <Form.Item label="默认选择">
        <Select
          mode="multiple"
          options={selectWidgetItem?.config?.options}
          value={selectWidgetItem?.config?.defaultValue}
          onChange={(option) => handleChange(option, 'config.defaultValue')}
        />
      </Form.Item>
      <Form.Item label="限制条件" >
        <Checkbox
          checked={selectWidgetItem?.config?.required}
          onChange={(e) => handleChange(e.target.checked, 'config.required')}
        >
          该项为必填项
        </Checkbox>
        <Form.Item >
          <Checkbox
            checked={showLengthInput}
            onChange={(e) => {
              setShowLengthInput(e.target.checked)
              if (!e.target.checked){
                handleChange(selectWidgetItem?.config?.options.length, 'config.maxLength')
              }
            }}
          >
            最多选择几项
          </Checkbox>
          {
            showLengthInput &&
            <InputNumber
              max={selectWidgetItem?.config?.options.length}
              min={2}
              value={selectWidgetItem?.config?.maxLength}
              onChange={(value) => handleChange(value, 'config.maxLength')}
            />
          }
        </Form.Item>
      </Form.Item>
    </>
  )
}
export default ImagePickerConfig
