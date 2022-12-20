import {
  FC,
  MouseEvent,
  useContext,
  useEffect,
  memo,
  useMemo,
  useRef,
  useState
} from 'react';
import {
  Col,
  Row,
  Space,
  Form,
  FormInstance,
  Checkbox,
  Input,
  Radio, Modal,
  Popconfirm,
  Select,
  DatePicker, Cascader,
} from 'antd';
import Sortable from 'sortablejs'
import { cloneDeep, isArray, isString } from 'lodash-es'
import moment from 'moment'
import deleteIcon from '@/assets/page_creat_manage/delete.png'
import copyIcon from '@/assets/page_creat_manage/copy.png'
import { DesignContext } from '../store'
import { ActionType } from '../store/action'
import { Component } from '../config'
import { removeDomNode, createNewWidgetFormList } from '../utils'

interface Props {
  item: Component
  formInstance: FormInstance
  areaCodeOptions: {
    county: any[],
    city: any[],
    province: any[]
  }
}

const WidgetFormItem: FC<Props> = (props) => {
  const {
    item,
    item: { key, type, label, config, childNodes, formItemConfig },
    formInstance,
    areaCodeOptions
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

  const [checkBoxValue, setCheckBoxValue] = useState<string[]>([])

  const [mulSelectValue, setMulSelectValue] = useState<string[]>([])

  const [imageSelectValue, setImageSelectValue] = useState<string[]>([])

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
        animation: 100,
        group: {
          name: 'people'
        },
        setData: (dataTransfer) => {
          dataTransfer.setData('SortableDataMove', selectWidgetItemRef?.current?.key || '')
        },
        onAdd: (event: any) => {
          const { newIndex } = event
          const uuid = `${+new Date()}`
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
        newList[index].key = `${newList[index].type}_${+new Date()}`
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
          newItem.key = `${item.type}_${+new Date()}`
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


  const getDefaultShowList = (list: any) => {

    let controlAllList: string[] = []
    list.forEach((listItem: any) => {
      controlAllList = [...new Set([...controlAllList, ...(listItem.controlList || [])])]
    })
    // 获取所有默认值 show_list
    let showList: string[] = []
    list.forEach((listItem: any) => {
      const defaultValue = item.config?.defaultValue
      if(defaultValue?.length &&
        ['RadioGroup', 'CheckboxGroup', 'MultipleSelect', 'Select', 'ImagePicker'].indexOf(listItem.type) !== -1)
      {
        listItem.config.options.forEach((optionItem: {value: string, showList: string[]}) => {
          if (defaultValue instanceof Array &&
            defaultValue.indexOf(optionItem.value) !== -1
          ){
            showList = [...new Set([...showList, ...(optionItem.showList || [])])]
          }
          if (typeof defaultValue === 'string' && defaultValue === optionItem.value){
            showList = [...new Set([...showList, ...(optionItem.showList || [])])]
          }
        })
      }
    })
    // 将控制组件显示字段设置为true
    const newList = list.map((it: any) => {
      return {...it, hide: showList.indexOf(it.key!) !== -1 ? false : controlAllList.indexOf(it.key!) !== -1 ? true : false  }
    })
    console.log(newList, '0011newlist')
    return newList
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
      payload: getDefaultShowList(generateNewWidgetFormList(widgetFormList, key!))
    })
    dispatch({
      type: ActionType.SET_SELECT_WIDGET_ITEM,
      payload: undefined
    })
  }
  const renderActionIcon = () => {
    return (
      <>
        {selectWidgetItem?.key === key && (
          <>
            <div className="widget-view-action">
              <Popconfirm placement="bottomRight" title='确定删除该字段及对应表单数据？' onConfirm={(e) => {
                handleDeleteClick(e)
              }} okText="删除" cancelText="取消">
                <div>
                  <img className="img-icon" src={deleteIcon} alt='' />
                  <span>删除</span>
                </div>
              </Popconfirm>
              <div onClick={handleCopyClick}>
                <img className="img-icon" src={copyIcon} alt='' />
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
                <WidgetFormItem areaCodeOptions={areaCodeOptions} key={widgetFormItem.key} item={widgetFormItem} formInstance={formInstance} />
              ))}
              {renderActionIcon()}
            </Row>
          )}
          {type === 'Col' && (
            <Col {...commonProps} ref={sortableGroupDecorator}>
              {childNodes?.map((widgetFormItem) => (
                <WidgetFormItem areaCodeOptions={areaCodeOptions} key={widgetFormItem.key} item={widgetFormItem} formInstance={formInstance} />
              ))}
              {renderActionIcon()}
            </Col>
          )}
          {type === 'Space' && (
            <div className={className} ref={sortableGroupDecorator}>
              <Space {...commonProps}>
                {childNodes?.map((widgetFormItem) => (
                  <WidgetFormItem areaCodeOptions={areaCodeOptions} key={widgetFormItem.key} item={widgetFormItem} formInstance={formInstance} />
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
          <Form.Item label={config?.showLabel ? label : ''} required={config?.required}>
            {
              config?.desc && <div className="question-desc">{config.desc}</div>
            }
            <Form.Item
              name={key}
              getValueFromEvent={(value) => {
                const newValue = value.length > config?.maxLength ? value.filter((checkItem: string) => {
                  return checkBoxValue.indexOf(checkItem) !== -1
                }): value
                setCheckBoxValue(newValue)
                formInstance.setFieldsValue({key: newValue})
                return newValue
              }}
            >
              <Checkbox.Group
                options={config?.options.map((optionItem: {label: string, value: string}, index: number) => {
                  return {label: optionItem.label, value: `${optionItem.value}_${index}`}
                })}
                onChange={(value)=>{
                  if (value.length > config?.maxLength){
                    Modal.info({
                      title: '提示',
                      content: `此题最多只能选择${config?.maxLength}项`,
                      okText: '我知道了',
                    });
                  }
                }}
              />
            </Form.Item>
          </Form.Item>
        )}
        {type === 'Input' && (
          <Form.Item label={config?.showLabel ? label : ''} required={config?.required}>
            {
              config?.desc && <div className="question-desc">{config.desc}</div>
            }
            <Form.Item
              name={key}
              validateTrigger="onBlur"
              getValueFromEvent={(e) => {
                let newValue = e.target.value
                if (newValue && config?.regInfo?.reg){
                  newValue = newValue?.replace(/[^\d+]/g, '')
                  formInstance.setFieldsValue({key: newValue})
                }
                return newValue
              }}
              rules={
                [{
                  validator: (_, value) => {
                    if (config?.required && !value){
                      return Promise.reject(new Error('请输入内容'))
                    }
                    if (config?.regInfo?.reg && value){
                      const reg = new RegExp(config?.regInfo?.reg)
                      const validResult = reg.test(value)
                      if (!validResult){
                        return Promise.reject(new Error(config?.regInfo?.errorMsg))
                      }
                      return Promise.resolve()
                    }
                    return Promise.resolve()
                  }
                }]
              }
            >
              <Input
                allowClear={config?.allowClear}
                maxLength={config?.regInfo?.maxLength || config?.maxLength}
                placeholder={config?.placeholder}
              />
            </Form.Item>
          </Form.Item>
        )}
        {type === 'TextArea' && (
          <Form.Item label={config?.showLabel ? label : ''} required={config?.required}>
            {
              config?.desc && <div className="question-desc">{config.desc}</div>
            }
            <Form.Item
              name={key}
              validateTrigger="onBlur"
              getValueFromEvent={(e) => {
                let newValue = e.target.value
                if (newValue && config?.regInfo?.reg){
                  newValue = newValue?.replace(/[^\d+]/g, '')
                  formInstance.setFieldsValue({key: newValue})
                }
                return newValue
              }}
              rules={
                [{
                  validator: (_, value) => {
                    if (config?.required && !value){
                      return Promise.reject(new Error('请输入内容'))
                    }
                    if (config?.regInfo?.reg && value){
                      const reg = new RegExp(config?.regInfo?.reg)
                      const validResult = reg.test(value)
                      if (!validResult){
                        return Promise.reject(new Error(config?.regInfo?.errorMsg))
                      }
                      return Promise.resolve()
                    }
                    return Promise.resolve()
                  }
                }]
              }
            >
              <Input.TextArea
                rows={4}
                maxLength={config?.regInfo?.maxLength || config?.maxLength}
                placeholder={config?.placeholder}
              />
            </Form.Item>
          </Form.Item>
        )}
        {type === 'RadioGroup' && (
          <Form.Item label={config?.showLabel ? label : ''} required={config?.required}>
            {
              config?.desc && <div className="question-desc">{config.desc}</div>
            }
            <Form.Item name={key}>
              <Radio.Group
                options={config?.options.map((optionItem: {label: string, value: string}, index: number) => {
                  return {label: optionItem.label, value: `${optionItem.value}_${index}`}
                })}
                optionType={config?.optionType}
              />
            </Form.Item>
          </Form.Item>
        )}
        {type === 'MultipleSelect' && (
          <Form.Item label={config?.showLabel ? label : ''} required={config?.required}>
            {
              config?.desc && <div className="question-desc">{config.desc}</div>
            }
            <Form.Item
              name={key}
              getValueFromEvent={(value) => {
                const newValue = value.length > config?.maxLength ? value.filter((checkItem: string) => {
                  return mulSelectValue.indexOf(checkItem) !== -1
                }): value
                setMulSelectValue(newValue)
                formInstance.setFieldsValue({key: newValue})
                return newValue
              }}
            >
              <Select
                options={config?.options.map((optionItem: {label: string, value: string}, index: number) => {
                  return {label: optionItem.label, value: `${optionItem.value}_${index}`}
                })}
                allowClear
                placeholder={config?.placeholder}
                mode="multiple"
                onChange={(value)=>{
                  if (value.length > config?.maxLength){
                    Modal.info({
                      title: '提示',
                      content: `此题最多只能选择${config?.maxLength}项`,
                      okText: '我知道了',
                    });
                  }
                }}
              />
            </Form.Item>
          </Form.Item>
        )}
        {type === 'DatePicker' && (
          <Form.Item label={config?.showLabel ? label : ''} required={config?.required}>
            {
              config?.desc && <div className="question-desc">{config.desc}</div>
            }
            <Form.Item name={key}>
              <DatePicker
                showTime={config?.showTime}
                format={config?.format}
                placeholder={config?.placeholder}
                picker={config?.picker}
              />
            </Form.Item>
          </Form.Item>
        )}
        {type === 'Select' && (
          <Form.Item label={config?.showLabel ? label : ''} required={config?.required}>
            {
              config?.desc && <div className="question-desc">{config.desc}</div>
            }
            <Form.Item name={key}>
              <Select
                options={config?.options.map((optionItem: {label: string, value: string}, index: number) => {
                  return {label: optionItem.label, value: `${optionItem.value}_${index}`}
                })}
                allowClear
                placeholder={config?.placeholder}
              />
            </Form.Item>
          </Form.Item>
        )}
        {type === 'Cascader' && (
          <Form.Item label={config?.showLabel ? label : ''} required={config?.required}>
            {
              config?.desc && <div className="question-desc">{config.desc}</div>
            }
            <Form.Item name={key}>
              <Cascader
                fieldNames={{ label: 'name', value: 'code', children: 'nodes' }}
                options={config?.selectType === 'detailAddress' ? areaCodeOptions.county : areaCodeOptions[config?.selectType || 'county']}
                allowClear
              />
            </Form.Item>
            {
              config?.selectType === 'detailAddress' &&
              <Form.Item name={`${key}_detailAddress`}>
                <Input.TextArea
                  rows={4}
                  maxLength={200}
                  showCount
                  placeholder='请填写详细地址'
                />
              </Form.Item>
            }
          </Form.Item>
        )}
        {type === 'ImagePicker' && (
          <Form.Item label={config?.showLabel ? label : ''} required={config?.required}>
            {
              config?.desc && <div className="question-desc">{config.desc}</div>
            }
            <Form.Item
              name={key}
              getValueFromEvent={(value) => {
                const newValue = value.length > config?.maxLength ? value.filter((checkItem: string) => {
                  return imageSelectValue.indexOf(checkItem) !== -1
                }): value
                setImageSelectValue(newValue)
                formInstance.setFieldsValue({key: newValue})
                return newValue
              }}
            >
              <Checkbox.Group
                className="image-picker"
                onChange={(value)=>{
                  if (value.length > config?.maxLength){
                    Modal.info({
                      title: '提示',
                      content: `此题最多只能选择${config?.maxLength}项`,
                      okText: '我知道了',
                    });
                  }
                }}
              >
                {
                  config?.options.map((imgItem: {value: string, label: string}, index: number) => {
                    return (
                      <Checkbox key={index} value={imgItem.value}>
                        {
                          imgItem.value ? <div className="no-img"><img className="img" src={imgItem.value} alt='' /></div>
                            : <div className="no-img" />
                        }
                        <div className="img-picker-label">{imgItem.label}</div>
                      </Checkbox>
                    )
                  })
                }
              </Checkbox.Group>
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
