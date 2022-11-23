import { FC, MouseEvent, useContext, useEffect, memo, useMemo, useRef } from 'react'
import {
  Col,
  Row,
  Space,
  Form,
  FormInstance,
  Checkbox,
  Input,
  Radio, Modal,
} from 'antd';
import Sortable from 'sortablejs'
import { cloneDeep, isArray, isString } from 'lodash-es'
import { v4 } from 'uuid'
import moment from 'moment'
import { DesignContext } from '../store'
import { ActionType } from '../store/action'
import { Component } from '../config'
import { removeDomNode, createNewWidgetFormList } from '../utils'

interface Props {
  item: Component
  formInstance: FormInstance
}

const WidgetFormItem: FC<Props> = (props) => {
  const {
    item,
    item: { key, type, label, config, childNodes, formItemConfig },
    formInstance
  } = props

  const {
    state: { widgetFormList, selectWidgetItem },
    dispatch
  } = useContext(DesignContext)

  const selectWidgetItemRef = useRef(selectWidgetItem)

  useEffect(() => {
    selectWidgetItemRef.current = selectWidgetItem
  }, [selectWidgetItem])

  const className = useMemo(
    () => `widget-item-container ${selectWidgetItem?.key === key ? 'active' : ''} ${['Row', 'Col', 'Space'].includes(type) ? 'child-nodes' : ''}`,
    [selectWidgetItem]
  )

  const commonProps: Record<string, any> = {
    ...config,
    className: `${['Row', 'Col'].includes(type) ? className : ''}`
  }

  const commonFormItemProps: Record<string, any> = {
    ...formItemConfig,
    name: key,
    label
  }

  const { hidden } = commonProps
  delete commonProps.hidden
  if (['DatePicker', 'RangePicker', 'TimePicker'].includes(type) && formItemConfig?.initialValue) {
    if (isString(formItemConfig?.initialValue)) {
      commonFormItemProps.initialValue = moment(formItemConfig.initialValue, config?.format)
    }
    if (isArray(formItemConfig?.initialValue) && formItemConfig.initialValue.length === 2) {
      commonFormItemProps.initialValue = [moment(formItemConfig.initialValue[0], config?.format), moment(formItemConfig.initialValue[1], config?.format)]
    }
  }
  if (['Calendar'].includes(type) && config?.defaultValue) {
    commonProps.defaultValue = moment(commonProps.defaultValue)
  }
  const sortableGroupDecorator = (instance: HTMLDivElement | null) => {
    if (instance) {
      const options: Sortable.Options = {
        ghostClass: 'ghost',
        handle: '.drag-widget',
        animation: 200,
        group: {
          name: 'people'
        },
        setData: (dataTransfer) => {
          dataTransfer.setData('SortableDataMove', selectWidgetItemRef?.current?.key || '')
        },
        onAdd: (event: any) => {
          const { newIndex } = event
          const uuid = v4().replaceAll('-', '')
          const newChildNodes = cloneDeep(childNodes ?? [])
          const SortableDataClone = event.originalEvent.dataTransfer.getData('SortableDataClone')
          const SortableDataMove = event.originalEvent.dataTransfer.getData('SortableDataMove')
          removeDomNode('.widget-form-list .form-edit-widget-label')
          if (SortableDataMove) {
            const itemEl = event.item
            const origParent = event.from
            origParent.appendChild(itemEl)
            let newSelectWidgetItem: Component
            const generateNewWidgetFormList = (list: Component[], currentKey: string) => {
              const newList = cloneDeep(list)
              for (let index = 0; index < newList.length; index++) {
                if (newList[index].key === currentKey) {
                  newSelectWidgetItem = newList.splice(index, 1).at(0)!
                  break
                }
                if (newList[index].childNodes) {
                  newList[index].childNodes = generateNewWidgetFormList(newList[index].childNodes!, currentKey)
                }
              }

              return newList
            }
            const selectWidgetItemKey = SortableDataMove
            const newWidgetFormList = generateNewWidgetFormList(widgetFormList, selectWidgetItemKey)
            newChildNodes.splice(newIndex, 0, newSelectWidgetItem!)
            dispatch({
              type: ActionType.SET_WIDGET_FORM_LIST,
              payload: createNewWidgetFormList(newWidgetFormList, newChildNodes, key!)
            })
          }
          if (SortableDataClone) {
            const widgetFormItem = JSON.parse(SortableDataClone)
            const newItem = {
              ...widgetFormItem,
              key: `${widgetFormItem.type}_${uuid}`
            }
            newChildNodes.splice(newIndex, 0, newItem)
            dispatch({
              type: ActionType.SET_WIDGET_FORM_LIST,
              payload: createNewWidgetFormList(widgetFormList, newChildNodes, key!)
            })
            dispatch({
              type: ActionType.SET_SELECT_WIDGET_ITEM,
              payload: newItem
            })
          }
        }
      }

      Sortable.create(instance, options)
    }
  }

  const handleItemClick = (event: MouseEvent<HTMLSpanElement>) => {
    event.stopPropagation()
    const action = {
      type: ActionType.SET_SELECT_WIDGET_ITEM,
      payload: item
    }
    dispatch(action)
  }

  const handleCopyClick = (event: any) => {
    event.stopPropagation()
    let newItem
    const handleWidgetFormItem = (list: Component[]) => {
      const newList = cloneDeep(list)
      for (let index = 0; index < newList.length; index++) {
        newList[index].key = `${newList[index].type}_${v4().replaceAll('-', '')}`
        if (newList[index].childNodes) {
          newList[index].childNodes = handleWidgetFormItem(newList[index].childNodes!)
        }
      }
      return newList
    }
    const generateNewWidgetFormList = (list: Component[], currentKey: string) => {
      const newList = cloneDeep(list)
      for (let index = 0; index < newList.length; index++) {
        if (newList[index].key === currentKey) {
          newItem = cloneDeep(newList[index])
          newItem.key = `${item.type}_${v4().replaceAll('-', '')}`
          newList.splice(index, 0, newItem)
          if (newList[index].childNodes) {
            newList[index].childNodes = handleWidgetFormItem(newList[index].childNodes!)
          }
          break
        }
        if (newList[index].childNodes) {
          newList[index].childNodes = generateNewWidgetFormList(newList[index].childNodes!, currentKey)
        }
      }

      return newList
    }
    dispatch({
      type: ActionType.SET_WIDGET_FORM_LIST,
      payload: generateNewWidgetFormList(widgetFormList, key!)
    })
    dispatch({
      type: ActionType.SET_SELECT_WIDGET_ITEM,
      payload: newItem
    })
  }

  const handleDeleteClick = (event: any) => {
    event.stopPropagation()
    const generateNewWidgetFormList = (list: Component[], currentKey: string) => {
      const newList = cloneDeep(list)
      for (let index = 0; index < newList.length; index++) {
        if (newList[index].key === currentKey) {
          newList.splice(index, 1)
          break
        }
        if (newList[index].childNodes) {
          newList[index].childNodes = generateNewWidgetFormList(newList[index].childNodes!, currentKey)
        }
      }
      return newList
    }
    dispatch({
      type: ActionType.SET_WIDGET_FORM_LIST,
      payload: generateNewWidgetFormList(widgetFormList, key!)
    })
    dispatch({
      type: ActionType.SET_SELECT_WIDGET_ITEM,
      payload: undefined
    })
  }
  useEffect(() => formInstance.resetFields([key!]), [selectWidgetItem?.formItemConfig?.initialValue])

  const renderActionIcon = () => {
    return (
      <>
        {selectWidgetItem?.key === key && (
          <>
            <div className="widget-view-action">
              <div onClick={(e) => {
                Modal.confirm({
                  title: '提示',
                  content: '确定删除该字段及对应表单数据？',
                  okText: '删除',
                  onOk: () => {
                    handleDeleteClick(e)
                  },
                });
              }}>
                <img className="img-icon" src={require('../image/delete.png')} alt='' />
                <span>删除</span>
              </div>
              <div onClick={handleCopyClick}>
                <img className="img-icon" src={require('../image/copy.png')} alt='' />
                <span>复制</span>
              </div>
            </div>
          </>
        )}
      </>
    )
  }

  const render = () => {
    if (['Row', 'Col', 'Space'].includes(type)) {
      return (
        <span className={`${hidden ? 'hidden' : ''}`} style={{ display: 'contents' }} onClick={(event) => handleItemClick(event)}>
          {type === 'Row' && (
            <Row {...commonProps} ref={sortableGroupDecorator}>
              {childNodes?.map((widgetFormItem) => (
                <WidgetFormItem key={widgetFormItem.key} item={widgetFormItem} formInstance={formInstance} />
              ))}
              {renderActionIcon()}
            </Row>
          )}
          {type === 'Col' && (
            <Col {...commonProps} ref={sortableGroupDecorator}>
              {childNodes?.map((widgetFormItem) => (
                <WidgetFormItem key={widgetFormItem.key} item={widgetFormItem} formInstance={formInstance} />
              ))}
              {renderActionIcon()}
            </Col>
          )}
          {type === 'Space' && (
            <div className={className} ref={sortableGroupDecorator}>
              <Space {...commonProps}>
                {childNodes?.map((widgetFormItem) => (
                  <WidgetFormItem key={widgetFormItem.key} item={widgetFormItem} formInstance={formInstance} />
                ))}
              </Space>
              {renderActionIcon()}
            </div>
          )}
        </span>
      )
    }
    return (
      <div className={`${className}`} onClick={(event) => handleItemClick(event)}>
        {type === 'CheckboxGroup' && (
          <Form.Item label={label} required={config?.required}>
            {
              config?.desc && <div className="question-desc">{config.desc}</div>
            }
            <Form.Item>
              <Checkbox.Group
                options={config?.options}
                value={config?.defaultValue}
              />
            </Form.Item>
          </Form.Item>
        )}
        {type === 'Input' && (
          <Form.Item label={label} required={config?.required}>
            {
              config?.desc && <div className="question-desc">{config.desc}</div>
            }
            <Form.Item>
              <Input
                allowClear={config?.allowClear}
                maxLength={config?.maxLength}
                placeholder={config?.placeholder}
              />
            </Form.Item>
          </Form.Item>
        )}
        {type === 'TextArea' && (
          <Form.Item label={label} required={config?.required}>
            {
              config?.desc && <div className="question-desc">{config.desc}</div>
            }
            <Form.Item>
              <Input.TextArea
                autoSize={config?.autoSize}
                maxLength={config?.maxLength}
                placeholder={config?.placeholder}
              />
            </Form.Item>
          </Form.Item>
        )}
        {type === 'RadioGroup' && (
          <Form.Item label={label} required={config?.required}>
            {
              config?.desc && <div className="question-desc">{config.desc}</div>
            }
            <Form.Item>
              <Radio.Group
                options={config?.options}
                optionType={config?.optionType}
                value={config?.defaultValue}
              />
            </Form.Item>
          </Form.Item>
        )}
        {renderActionIcon()}
      </div>
    )
  }
  return render()
}

export default memo(WidgetFormItem)
