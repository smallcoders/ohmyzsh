import { FC } from 'react'
import { Form } from 'antd'
import ButtonConfig from '../config/ButtonConfig'
import TextConfig from '../config/TextConfig'
import RowConfig from '../config/RowConfig'
import ColConfig from '../config/ColConfig'
import CascaderConfig from '../config/CascaderConfig'
import CheckboxConfig from '../config/CheckboxConfig'
import CheckboxGroupConfig from '../config/CheckboxGroupConfig'
import DatePickerConfig from '../config/DatePickerConfig'
import RangePickerConfig from '../config/RangePickerConfig'
import InputConfig from '../config/InputConfig'
import TextAreaConfig from '../config/TextAreaConfig'
import InputNumberConfig from '../config/InputNumberConfig'
import RadioGroupConfig from '../config/RadioGroupConfig'
import TreeSelectConfig from '../config/TreeSelectConfig'
import SelectConfig from '../config/SelectConfig'
import MultipleSelectConfig from '../config/MultipleSelectConfig'
import UploadConfig from '../config/UploadConfig'
import ImageConfig from '../config/ImageConfig'
import TableConfig from '../config/TableConfig'
import TreeConfig from '../config/TreeConfig'
import ImagePickerConfig from '../config/ImagePickerConfig'
import { useConfig } from '../hooks/hooks'

const WidgetConfig: FC = () => {
  const { selectWidgetItem } = useConfig()
  if (!selectWidgetItem){
    return <div className="empty-config">点击选择字段来设置属性</div>
  }
  return (
    <>
      <Form layout="vertical">
        {selectWidgetItem?.type === 'Button' && <ButtonConfig />}
        {selectWidgetItem?.type === 'Text' && <TextConfig />}
        {selectWidgetItem?.type === 'Row' && <RowConfig />}
        {selectWidgetItem?.type === 'Col' && <ColConfig />}
        {selectWidgetItem?.type === 'Cascader' && <CascaderConfig />}
        {selectWidgetItem?.type === 'Checkbox' && <CheckboxConfig />}
        {selectWidgetItem?.type === 'CheckboxGroup' && <CheckboxGroupConfig />}
        {selectWidgetItem?.type === 'DatePicker' && <DatePickerConfig />}
        {selectWidgetItem?.type === 'RangePicker' && <RangePickerConfig />}
        {selectWidgetItem?.type === 'Input' && <InputConfig />}
        {selectWidgetItem?.type === 'TextArea' && <TextAreaConfig />}
        {selectWidgetItem?.type === 'InputNumber' && <InputNumberConfig />}
        {selectWidgetItem?.type === 'RadioGroup' && <RadioGroupConfig />}
        {selectWidgetItem?.type === 'TreeSelect' && <TreeSelectConfig />}
        {selectWidgetItem?.type === 'Upload' && <UploadConfig />}
        {selectWidgetItem?.type === 'Image' && <ImageConfig />}
        {selectWidgetItem?.type === 'Table' && <TableConfig />}
        {selectWidgetItem?.type === 'Tree' && <TreeConfig />}
        {selectWidgetItem?.type === 'MultipleSelect' && <MultipleSelectConfig />}
        {selectWidgetItem?.type === 'Select' && <SelectConfig />}
        {selectWidgetItem?.type === 'ImagePicker' && <ImagePickerConfig />}
      </Form>
    </>
  )
}

export default WidgetConfig
