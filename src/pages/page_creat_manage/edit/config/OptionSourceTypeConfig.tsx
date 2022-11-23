import { FC, useState } from 'react'
import { Form, Input, Button, message } from 'antd'
import Sortable from 'sortablejs'
import { clone } from 'lodash-es'
import { useConfig } from '../hooks/hooks'
interface Props {
  multiple?: boolean
}

interface options {
  label: string; value: string
}

const OptionSourceTypeConfig: FC<Props> = (props) => {
  const { multiple } = props

  const { selectWidgetItem, handleChange } = useConfig()
  const [errorMsg, setErrorMsg] = useState<string>('')

  const sortableGroupDecorator = (instance: HTMLUListElement | null) => {
    if (instance) {
      const options: Sortable.Options = {
        ghostClass: 'ghost',
        handle: '.drag-item',
        group: {
          name: 'options'
        },
        onEnd: (event) => {
          const { newIndex, oldIndex } = event
          const configOptions: [] = clone(selectWidgetItem!.config!.options)
          const oldOption = configOptions.splice(oldIndex!, 1)
          configOptions.splice(newIndex!, 0, ...oldOption)
          handleChange(configOptions, 'config.options')
        }
      }
      Sortable.create(instance, options)
    }
  }


  const getErrorMsg = (options: any) => {
    const valueList = options.map((item: options) => {
      return item.value
    })
    setErrorMsg([...new Set(valueList)].length < valueList.length ? '选项重复，请修改' : "")
  }

  return (
    <Form.Item label="选项">
      {
        errorMsg && <div className="error-tip">{errorMsg}</div>
      }
      <>
        {multiple ? (
          <div>
            <ul ref={sortableGroupDecorator}>
              {selectWidgetItem?.config?.options?.map((option: { label: string; value: string }, index: number) => (
                <li key={index}>
                  <div className="option-item">
                    <img className="drag-item" src={require('../image/drag-item.png')} alt='' />
                    <Input
                      value={option.value}
                      size="small"
                      onChange={(event) => {
                        const configOptions = clone(selectWidgetItem!.config!.options)
                        configOptions[index].value = event.target.value
                        configOptions[index].label = event.target.value
                        handleChange(configOptions, 'config.options')
                        getErrorMsg(configOptions)
                      }}
                    />
                    <Button
                      type="ghost"
                      shape="circle"
                      size="small"
                      onClick={() => {
                        if (selectWidgetItem?.config?.options.length <= 3){
                          message.warn('请至少保留三个选项', 2)
                          return
                        }
                        const configOptions = clone(selectWidgetItem!.config!.options)
                        const findIndex = selectWidgetItem?.config?.defaultValue?.indexOf(configOptions[index].value)
                        if(findIndex !== -1){
                          const defaultValue = clone(selectWidgetItem!.config!.defaultValue)
                          defaultValue.splice(findIndex, 1)
                          handleChange(defaultValue, 'config.defaultValue')
                        }

                        configOptions.splice(index, 1)

                        if(configOptions.length < selectWidgetItem?.config?.maxLength){
                          handleChange(configOptions.length, 'config.maxLength')
                        }
                        handleChange(configOptions, 'config.options')
                        getErrorMsg(configOptions)
                      }}
                    >
                      —
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div>
            <ul ref={sortableGroupDecorator}>
              {selectWidgetItem?.config?.options?.map((option: { label: string; value: string }, index: number) => (
                <li key={index}>
                  <div className="option-item">
                    <img className="drag-item" src={require('../image/drag-item.png')} alt='' />
                    <Input
                      value={option.value}
                      size="small"
                      onChange={(event) => {
                        const configOptions = clone(selectWidgetItem!.config!.options)
                        configOptions[index].value = event.target.value
                        configOptions[index].label = event.target.value
                        handleChange(configOptions, 'config.options')
                        getErrorMsg(configOptions)
                      }}
                      maxLength={50}
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
                        const configOptions = clone(selectWidgetItem?.config?.options)
                        if(configOptions[index].value === selectWidgetItem?.config?.defaultValue){
                          handleChange('', 'config.defaultValue')
                        }
                        configOptions.splice(index, 1)
                        handleChange(configOptions, 'config.options')
                        getErrorMsg(configOptions)
                      }}
                    >
                      —
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        <Button
          className="insert-btn"
          type="link"
          size="small"
          onClick={() => {
            const configOptions = clone(selectWidgetItem!.config!.options)
            const value = `选项${configOptions.length + 1}`
            configOptions.push({ label: value, value })
            handleChange(configOptions, 'config.options')
          }}
        >
          添加选项
        </Button>
      </>
    </Form.Item>
  )
}

OptionSourceTypeConfig.defaultProps = {
  multiple: false
}

export default OptionSourceTypeConfig
