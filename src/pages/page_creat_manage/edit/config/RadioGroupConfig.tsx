import { useContext, useEffect, useState } from 'react';
import {
  Checkbox,
  Form, Input, Select,
  Modal
} from 'antd';
import { useConfig } from '../hooks/hooks'
import OptionSourceTypeConfig from '../config/OptionSourceTypeConfig'
import { DesignContext } from '@/pages/page_creat_manage/edit/store';
import { clone, cloneDeep } from 'lodash-es';
import { ActionType } from '@/pages/page_creat_manage/edit/store/action';

const RadioGroupConfig = () => {
  const { state, dispatch } = useContext(DesignContext)
  const { widgetFormList } = state
  const { selectWidgetItem, handleChange } = useConfig()
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const componentsList = widgetFormList.filter((listItem) => {
    return listItem.key !== selectWidgetItem!.key
  }).map((formItem) => {
    return {
      label: formItem.label,
      value: formItem.key
    }
  }) || []
  const [controlList, setControlList] = useState<string[]>(clone(selectWidgetItem?.controlList) || [])
  const [configOptions, setConfigOptions] = useState<string[]>(clone(selectWidgetItem?.config?.options) || [])
  useEffect(() => {
    setControlList(clone(selectWidgetItem?.controlList) || [])
  }, [selectWidgetItem?.controlList])
  useEffect(() => {
    setConfigOptions(clone(selectWidgetItem?.config?.options) || [])
  }, [selectWidgetItem?.config?.options])

  const getDefaultShowList = () => {
    // 获取所有控制组件
    let controlAllList = controlList
    const list = widgetFormList.filter((it) => {
      return it.key !== selectWidgetItem!.key
    })
    list.forEach((item) => {
      controlAllList = [...new Set([...controlAllList, ...(item.controlList || [])])]
    })
    // 获取所有默认值 show_list
    let showList: string[] = []
    widgetFormList.forEach((item: any) => {
      const defaultValue = item.config?.defaultValue
      if(defaultValue?.length && !item.hide &&
        ['RadioGroup', 'CheckboxGroup', 'MultipleSelect', 'Select', 'ImagePicker'].indexOf(item.type) !== -1)
      {
        item.config.options.forEach((optionItem: {value: string, showList: string[]}) => {
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
    state.widgetFormList = widgetFormList.map((it) => {
      return {...it, hide: showList.indexOf(it.key!) !== -1 ? false : controlAllList.indexOf(it.key!) !== -1 ? true : false  }
    })
    dispatch({
      type: ActionType.SET_GLOBAL,
      payload: {...state}
    })
  }


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
              handleChange('单选按钮组', 'label')
              handleChange("单选按钮组", 'config.paramDesc')
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
      <Form.Item label="描述信息" >
        <Input.TextArea
          value={selectWidgetItem?.config?.desc}
          maxLength={50}
          onChange={(event) => handleChange(event.target.value, 'config.desc')}
        />
      </Form.Item>
      <OptionSourceTypeConfig />
      <Form.Item label="题目关联">
        <div className="related-click" onClick={() => {
          setIsModalOpen(true)
        }}>点击配置</div>
      </Form.Item>
      <Form.Item label="默认选择">
        <Select
          allowClear
          options={selectWidgetItem?.config?.options}
          value={selectWidgetItem?.config?.defaultValue}
          onChange={(option) => {
            widgetFormList.forEach((item: any, index) => {
              if (item.key === selectWidgetItem?.key){
                widgetFormList[index]!.config!.defaultValue = option
              }
            })
            getDefaultShowList()
            handleChange(option, 'config.defaultValue')
          }}
        />
      </Form.Item>
      <Form.Item label="限制条件" >
        <Checkbox
          checked={selectWidgetItem?.config?.required}
          onChange={(e) => handleChange(e.target.checked, 'config.required')}
        >
          该项为必填项
        </Checkbox>
      </Form.Item>
      <Modal
        title="题目关联"
        visible={isModalOpen}
        onOk={() => {
          handleChange(configOptions, 'config.options')
          // 获取所有默认值 show_list
          getDefaultShowList()
          handleChange(controlList, 'controlList')
          setIsModalOpen(false)
        }}
        onCancel={() => {
          setIsModalOpen(false)
        }} >
        <div className="config-related-modal">
          <div className="sub-title">
            选择选项后, 才会显示配置的题目
          </div>
          <div className="content-title">
            <div className="left">
              选项内容
            </div>
            <div className="right">
              显示字段
            </div>
          </div>
          <div className="config-related-content">
            {
              configOptions?.map((item: any, index: number) => {
                return (
                  <div key={index}>
                    <div className="option-title">{item.label}</div>
                    <Select
                      allowClear
                      showArrow
                      options={componentsList}
                      value={item.showList}
                      mode="multiple"
                      onChange={(value) => {
                        const newConfigOptions: any = cloneDeep(configOptions)
                        newConfigOptions[index].showList = value
                        setConfigOptions(newConfigOptions)
                        // 当前组件所有选项的控制列表
                        let controlKeyList: string[] = [];
                        newConfigOptions.forEach((optionItem: {showList: string[]}) => {
                          controlKeyList = [...new Set([...controlKeyList, ...(optionItem.showList || [])])]
                        })
                        setControlList(controlKeyList)
                      }}
                    />
                  </div>
                )
              })
            }
          </div>
        </div>
      </Modal>
    </>
  )
}

export default RadioGroupConfig
