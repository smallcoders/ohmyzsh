import { FC } from 'react'
import { Form } from 'antd'
import ButtonConfig from '../config/ButtonConfig'
import TextConfig from '../config/TextConfig'
import TitleConfig from '../config/TitleConfig'
import VideoConfig from '../config/VideoConfig'
import RowConfig from '../config/RowConfig'
import ColConfig from '../config/ColConfig'
import CascaderConfig from '../config/CascaderConfig'
import CheckboxGroupConfig from '../config/CheckboxGroupConfig'
import DatePickerConfig from '../config/DatePickerConfig'
import InputConfig from '../config/InputConfig'
import TextAreaConfig from '../config/TextAreaConfig'
import RadioGroupConfig from '../config/RadioGroupConfig'
import SelectConfig from '../config/SelectConfig'
import MultipleSelectConfig from '../config/MultipleSelectConfig'
import UploadConfig from '../config/UploadConfig'
import ImageConfig from '../config/ImageConfig'
import TableConfig from '../config/TableConfig'
import ImagePickerConfig from '../config/ImagePickerConfig'
import { useConfig } from '../hooks/hooks'
import '../style/widgetConfig.less'

const WidgetConfig: FC = () => {
  const { selectWidgetItem } = useConfig()
  if (!selectWidgetItem){
    return <div className="empty-config">点击选择字段来设置属性</div>
  }
  return (
    <>
      <Form layout="vertical">
        {selectWidgetItem?.type === 'Button' && <ButtonConfig />}
        {selectWidgetItem?.type === 'Title' && <TitleConfig />}
        {selectWidgetItem?.type === 'Video' && <VideoConfig />}
        {selectWidgetItem?.type === 'Text' && <TextConfig />}
        {selectWidgetItem?.type === 'Row' && <RowConfig />}
        {selectWidgetItem?.type === 'Col' && <ColConfig />}
        {selectWidgetItem?.type === 'Cascader' && <CascaderConfig />}
        {selectWidgetItem?.type === 'CheckboxGroup' && <CheckboxGroupConfig />}
        {selectWidgetItem?.type === 'DatePicker' && <DatePickerConfig />}
        {selectWidgetItem?.type === 'Input' && <InputConfig />}
        {selectWidgetItem?.type === 'TextArea' && <TextAreaConfig />}
        {selectWidgetItem?.type === 'RadioGroup' && <RadioGroupConfig />}
        {selectWidgetItem?.type === 'Upload' && <UploadConfig />}
        {selectWidgetItem?.type === 'Image' && <ImageConfig />}
        {selectWidgetItem?.type === 'Table' && <TableConfig />}
        {selectWidgetItem?.type === 'MultipleSelect' && <MultipleSelectConfig />}
        {selectWidgetItem?.type === 'Select' && <SelectConfig />}
        {selectWidgetItem?.type === 'ImagePicker' && <ImagePickerConfig />}
      </Form>
    </>
  )
}

export default WidgetConfig
