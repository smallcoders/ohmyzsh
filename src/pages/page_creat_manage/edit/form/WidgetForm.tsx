import { FC, useContext, useEffect, useRef } from 'react'
import { Form, FormInstance } from 'antd'
import Sortable from 'sortablejs'
import { cloneDeep } from 'lodash-es'
import emptyIcon from '@/assets/page_creat_manage/empty.png'
import WidgetFormItem from '../form/WidgetFormItem'
import { DesignContext } from '../store'
import { ActionType } from '../store/action'
import { removeDomNode } from '../utils'
import { Component } from '../config'
interface Props {
  formInstance: FormInstance
}
const WidgetForm: FC<Props> = (props) => {
  const { formInstance } = props
  const { state, dispatch } = useContext(DesignContext)
  const widgetFormListRef = useRef(state.widgetFormList)
  const selectWidgetItemRef = useRef(state.selectWidgetItem)

  useEffect(() => {
    widgetFormListRef.current = state.widgetFormList
  }, [state.widgetFormList])

  useEffect(() => {
    selectWidgetItemRef.current = state.selectWidgetItem
  }, [state.selectWidgetItem])

  const sortableGroupDecorator = (instance: HTMLDivElement | null) => {
    if (instance) {
      const options: Sortable.Options = {
        ghostClass: 'ghost',
        handle: '.widget-item-container',
        animation: 500,
        group: {
          name: 'people'
        },
        setData: (dataTransfer) => {
          dataTransfer.setData('SortableDataMove', selectWidgetItemRef.current?.key || '')
        },
        onAdd: (event: any) => {
          const { newIndex } = event
          const key = `${+new Date()}`
          const widgetFormList = cloneDeep(state.widgetFormList)
          const SortableDataClone = event.originalEvent.dataTransfer.getData('SortableDataClone')
          const SortableDataMove = event.originalEvent.dataTransfer.getData('SortableDataMove')
          removeDomNode('.widget-form-list>.form-edit-widget-label')
          if (SortableDataMove) {
            const itemEl = event.item
            const origParent = event.from
            origParent.appendChild(itemEl)

            let newSelectWidgetItem: Component

            const generateNewWidgetFormList = (list: Component[], currentKey: string) => {
              const newList = cloneDeep(list)

              for (let index = 0; index < newList.length; index++) {
                if (newList[index].key === key) {
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

            newWidgetFormList.splice(newIndex, 0, newSelectWidgetItem!)

            dispatch({
              type: ActionType.SET_WIDGET_FORM_LIST,
              payload: newWidgetFormList
            })
          }
          if (SortableDataClone) {
            const widgetFormItem = JSON.parse(SortableDataClone)

            const newItem = {
              ...widgetFormItem,
              key: `${widgetFormItem.type}_${key}`
            }

            widgetFormList.splice(newIndex, 0, newItem)

            dispatch({
              type: ActionType.SET_WIDGET_FORM_LIST,
              payload: widgetFormList
            })

            dispatch({
              type: ActionType.SET_SELECT_WIDGET_ITEM,
              payload: newItem
            })
          }
        },
        onUpdate: (event) => {
          const { newIndex, oldIndex } = event
          const widgetFormList = cloneDeep(widgetFormListRef.current)

          widgetFormList.splice(newIndex!, 1, ...widgetFormList.splice(oldIndex!, 1, widgetFormList[newIndex!]))

          dispatch({
            type: ActionType.SET_WIDGET_FORM_LIST,
            payload: widgetFormList
          })
        }
      }

      Sortable.create(instance, options)
    }
  }

  return (
    <div className="widget-form-container">
      {
        <div className="base-info">
          <div className="base-info-title">
            基本设置
          </div>
          {
            state.globalConfig.pageName &&
            <div className="page-name">{state.globalConfig.pageName}</div>
          }
          {
            state.globalConfig.pageDesc &&
            <div className="page-name">{state.globalConfig.pageDesc}</div>
          }
          {
            state.globalConfig.pageBg &&
            <img className="page-bg" src={state.globalConfig.pageBg} alt='' />
          }
        </div>
      }
      <div>
        {
          state.widgetFormList.length > 0 && <div className="questions-title">题目设置</div>
        }
        <Form {...state.formConfig} form={formInstance}>
          <div ref={sortableGroupDecorator} className="widget-form-list">
            {!state.widgetFormList.length &&
            <div className="form-empty">
              <img src={emptyIcon} alt='' />
              从左侧拖拽来添加字段
            </div>}
            {state.widgetFormList.map((widgetFormItem) => (
              <WidgetFormItem key={widgetFormItem.key} item={widgetFormItem} formInstance={formInstance} />
            ))}
          </div>
        </Form>
      </div>
    </div>
  )
}

export default WidgetForm
