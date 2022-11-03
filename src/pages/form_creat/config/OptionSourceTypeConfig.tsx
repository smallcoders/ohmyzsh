import React, { FC } from 'react'
import { Form, Radio, Input, Button, Space, Checkbox } from 'antd'
import Sortable from 'sortablejs'
import { clone } from 'lodash-es'
import { useConfig } from '../hooks'
// import { sourceOptions } from '../utils/options'

interface Props {
  multiple?: boolean
}

const OptionSourceTypeConfig: FC<Props> = (props) => {
  const { multiple } = props

  const { selectWidgetItem, handleChange, sourceType, setSourceType } = useConfig()

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

  return (
    <Form.Item label="选项">
      <>
        {multiple ? (
          <Checkbox.Group defaultValue={selectWidgetItem?.formItemConfig?.initialValue} onChange={(checkedValue) => handleChange(checkedValue, 'formItemConfig.initialValue')}>
            <ul ref={sortableGroupDecorator}>
              {selectWidgetItem?.config?.options?.map((option: { label: string; value: string }, index: number) => (
                <li key={option.value}>
                  <Checkbox value={option.value}>
                    <div className="option-item">
                      <Input
                        value={option.label}
                        size="small"
                        onChange={(event) => {
                          const configOptions = clone(selectWidgetItem!.config!.options)
                          configOptions[index].label = event.target.value
                          handleChange(configOptions, 'config.options')
                        }}
                      />
                      <Input
                        value={option.value}
                        size="small"
                        onChange={(event) => {
                          const configOptions = clone(selectWidgetItem!.config!.options)
                          configOptions[index].value = event.target.value
                          handleChange(configOptions, 'config.options')
                        }}
                      />
                      <img className="drag-item" src={require('../image/drag-item.png')} alt='' />
                      <Button
                        type="primary"
                        shape="circle"
                        size="small"
                        onClick={() => {
                          const configOptions = clone(selectWidgetItem!.config!.options)
                          configOptions.splice(index, 1)
                          handleChange(configOptions, 'config.options')
                        }}
                      >
                        <img className="image-icon" src={require('../image/delete.png')} alt='' />
                      </Button>
                    </div>
                  </Checkbox>
                </li>
              ))}
            </ul>
          </Checkbox.Group>
        ) : (
          <Radio.Group defaultValue={selectWidgetItem?.formItemConfig?.initialValue}>
            <ul ref={sortableGroupDecorator}>
              {selectWidgetItem?.config?.options?.map((option: { label: string; value: string }, index: number) => (
                <li key={option.value}>
                  <Radio value={option.value} onChange={(e) => handleChange(e.target.value, 'formItemConfig.initialValue')}>
                    <div className="option-item">
                      <Input
                        value={option.label}
                        size="small"
                        onChange={(event) => {
                          const configOptions = clone(selectWidgetItem!.config!.options)
                          configOptions[index].label = event.target.value
                          handleChange(configOptions, 'config.options')
                        }}
                      />
                      <Input
                        value={option.value}
                        size="small"
                        onChange={(event) => {
                          const configOptions = clone(selectWidgetItem!.config!.options)
                          configOptions[index].value = event.target.value
                          handleChange(configOptions, 'config.options')
                        }}
                      />
                      <img className="drag-item" src={require('../image/drag-item.png')} alt='' />
                      <Button
                        type="primary"
                        shape="circle"
                        size="small"
                        onClick={() => {
                          const configOptions = clone(selectWidgetItem!.config!.options)
                          configOptions.splice(index, 1)
                          handleChange(configOptions, 'config.options')
                        }}
                      >
                        <img className="image-icon" src={require('../image/delete.png')} alt='' />
                      </Button>
                    </div>
                  </Radio>
                </li>
              ))}
            </ul>
          </Radio.Group>
        )}
        <Button
          className="insert-btn"
          type="link"
          size="small"
          onClick={() => {
            const configOptions = clone(selectWidgetItem!.config!.options)
            const value = `Option${configOptions.length + 1}`
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
