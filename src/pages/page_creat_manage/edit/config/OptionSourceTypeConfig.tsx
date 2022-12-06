import { useState } from 'react'
import { Form, Input, Button, message, Select } from 'antd';
import Sortable from 'sortablejs'
import { clone } from 'lodash-es'
import dragIcon from '@/assets/page_creat_manage/drag-item.png'
import { useConfig } from '../hooks/hooks'
import { regOptions } from '@/pages/page_creat_manage/edit/utils/options';
interface Props {
  multiple?: boolean
}

interface options {
  label: string; value: string
}

const OptionSourceTypeConfig = (props: Props) => {
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
          handleChange(clone(configOptions), 'config.options')
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
  const options = selectWidgetItem?.config?.options
  return (
    <Form.Item label="选项">
      {
        errorMsg && <div className="error-tip">{errorMsg}</div>
      }
      <>
        {multiple ? (
          <div>
            <ul ref={sortableGroupDecorator}>
              {options?.map((option: { label: string; value: string, index: number }, id: number) => (
                <li key={`${option.index}`}>
                  <div className="option-item">
                    <img className="drag-item" src={dragIcon} alt='' />
                    <Input
                      value={option.label}
                      size="small"
                      onChange={(event) => {
                        const configOptions = clone(selectWidgetItem!.config!.options)
                        configOptions[id].value = event.target.value
                        configOptions[id].label = event.target.value
                        handleChange(configOptions, 'config.options')
                        getErrorMsg(configOptions)
                      }}
                      onBlur={(e) => {
                        if (!e.target.value){
                          const configOptions = clone(selectWidgetItem!.config!.options)
                          const indexList: number[] = configOptions.map((item: {label: string, value: string, index: number}) => {
                            return  Number(item.label.replace('选项', '')) || item.index
                          })
                          const max = Math.max(...indexList)
                          const value = `选项${max + 1}`
                          configOptions[id].value = value
                          configOptions[id].label = value
                          configOptions[id].index = max + 1
                          handleChange(configOptions, 'config.options')
                        }
                      }}
                    />
                    <Select
                      allowClear
                      options={regOptions}
                      value={selectWidgetItem?.config?.reg}
                      onChange={(value) => handleChange(value, 'config.reg')}
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
              {options?.map((option: { label: string; value: string, index: number }, id: number) => {
                return (
                  <li key={`${option.index}`}>
                    <div className="option-item">
                      <img className="drag-item" src={dragIcon} alt='' />
                      <Input
                        value={option.label}
                        size="small"
                        onChange={(event) => {
                          const configOptions = clone(selectWidgetItem!.config!.options)
                          configOptions[id].value = event.target.value
                          configOptions[id].label = event.target.value
                          handleChange(configOptions, 'config.options')
                          getErrorMsg(configOptions)
                        }}
                        onBlur={(e) => {
                          if (!e.target.value){
                            const configOptions = clone(selectWidgetItem!.config!.options)
                            const indexList: number[] = configOptions.map((item: {label: string, value: string, index: number}) => {
                              return  Number(item.label.replace('选项', '')) || item.index
                            })
                            const max = Math.max(...indexList)
                            const value = `选项${max + 1}`
                            configOptions[id].value = value
                            configOptions[id].label = value
                            configOptions[id].index = max + 1
                            handleChange(configOptions, 'config.options')
                          }
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
                          if(configOptions[id].value === selectWidgetItem?.config?.defaultValue){
                            handleChange('', 'config.defaultValue')
                          }
                          configOptions.splice(id, 1)
                          handleChange(configOptions, 'config.options')
                          getErrorMsg(configOptions)
                        }}
                      >
                        —
                      </Button>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
        <Button
          className="insert-btn"
          type="link"
          size="small"
          onClick={() => {
            const configOptions = clone(selectWidgetItem!.config!.options)
            const len = configOptions.length;
            const indexList: number[] = configOptions.map((item: {label: string, value: string, index: number}) => {
              return Number(item.label.replace('选项', '')) || item.index
            })
            const max = Math.max(...indexList)
            const label = `选项${max + 1}`
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
      </>
    </Form.Item>
  )
}

OptionSourceTypeConfig.defaultProps = {
  multiple: false
}

export default OptionSourceTypeConfig
