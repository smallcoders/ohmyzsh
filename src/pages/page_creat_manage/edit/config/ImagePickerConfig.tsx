import { useState, useContext, useEffect } from 'react';
import { Button, Checkbox, Form, Input, InputNumber, message, Modal, Select } from 'antd';
import { useConfig } from '../hooks/hooks'
import { DesignContext } from '@/pages/page_creat_manage/edit/store';
import { clone, cloneDeep } from 'lodash-es';
import Sortable from 'sortablejs';
import UploadForm from '@/components/upload_form';
import dragIcon from '@/assets/page_creat_manage/drag-item.png';
import { ActionType } from '@/pages/page_creat_manage/edit/store/action';

const ImagePickerConfig = () => {
  const { selectWidgetItem, handleChange } = useConfig()
  const { state, dispatch } = useContext(DesignContext)
  const { widgetFormList } = state
  const [showLengthInput, setShowLengthInput] = useState<boolean>(false)
  const [errorMsg, setErrorMsg] = useState<string>('')
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

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
    const valueList = options.map((item: {label: string}) => {
      return item.label
    })
    setErrorMsg([...new Set(valueList)].length < valueList.length ? '选项重复，请修改' : "")
  }

  const getDefaultValues = (options: any, defaultLabels: string[]) => {
   const defaultValues = options.filter((it: any) => {
      return selectWidgetItem?.config?.defaultValueLabels.indexOf(it.label) !== -1
    }).map((it: any) => {
      return it.value
    })
    handleChange(defaultLabels || [], 'config.defaultValueLabels')
    handleChange(defaultValues || [], 'config.defaultValue')
  }


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
      if(defaultValue?.length &&
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


  console.log(state, '0000001111111111111')

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
        {
          errorMsg && <div className="error-tip">{errorMsg}</div>
        }
        <ul ref={sortableGroupDecorator}>
          {selectWidgetItem?.config?.options?.map((option: { label: string, value: string, index: number }, id: number) => (
            <li key={`${option.index}`}>
              <div className="option-item">
                <img className="drag-item" src={dragIcon} alt='' />
                <UploadForm
                  listType="picture-card"
                  className="avatar-uploader"
                  maxSize={4}
                  action={'/antelope-common/common/file/upload/record'}
                  showUploadList={false}
                  accept=".bmp,.gif,.png,.jpeg,.jpg"
                  value={typeof option.value === 'number' ? '' : option?.value}
                  onChange={(value: any) => {
                    const newConfigOptions = clone(selectWidgetItem!.config!.options)
                    newConfigOptions[id].value = value?.path || value || ''
                    handleChange(newConfigOptions, 'config.options')
                    getDefaultValues(newConfigOptions, selectWidgetItem!.config!.defaultValueLabels)
                  }}
                />
                <Input
                  value={option.label}
                  size="small"
                  onChange={(event) => {
                    const newConfigOptions = clone(selectWidgetItem!.config!.options)
                    newConfigOptions[id].label = event.target.value
                    handleChange(configOptions, 'config.options')

                    // 获取新的label列表
                    const configLabels = newConfigOptions.map((item: any) => {
                      return item.label
                    })
                    // 剔除默认label中的被变更的数据
                    const newDefaultLabels = selectWidgetItem!.config!.defaultValueLabels.filter((label: string) => {
                      return configLabels.indexOf(label) !== -1
                    })
                    getDefaultValues(newConfigOptions, newDefaultLabels)
                    getErrorMsg(newConfigOptions)
                  }}
                  onBlur={(e) => {
                    if (!e.target.value){
                      const newConfigOptions = clone(selectWidgetItem!.config!.options)
                      const indexList: number[] = newConfigOptions.map((item: {label: string, value: string, index: number}) => {
                        return  Number(item.label.replace('选项', '')) || item.index
                      })
                      const max = Math.max(...indexList)
                      const value = `选项${max + 1}`
                      newConfigOptions[id].label = value
                      newConfigOptions[id].index = max + 1
                      newConfigOptions[id].showList = []
                      handleChange(newConfigOptions, 'config.options')
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
                    const newConfigOptions = clone(selectWidgetItem!.config!.options)
                    const findIndex = selectWidgetItem?.config?.defaultValueLabels?.indexOf(newConfigOptions[id].label)
                    if(findIndex !== -1){
                      const defaultValue = clone(selectWidgetItem!.config!.defaultValue)
                      defaultValue.splice(findIndex, 1)

                      const defaultValueLabels = clone(selectWidgetItem!.config!.defaultValueLabels)
                      defaultValueLabels.splice(findIndex, 1)

                      handleChange(defaultValueLabels, 'config.defaultValueLabels')

                      handleChange(defaultValue, 'config.defaultValue')
                    }
                    newConfigOptions.splice(id, 1)
                    if(newConfigOptions.length < selectWidgetItem?.config?.maxLength){
                      handleChange(newConfigOptions.length, 'config.maxLength')
                    }
                    handleChange(newConfigOptions, 'config.options')
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
            const newConfigOptions = clone(selectWidgetItem!.config!.options)
            const len = newConfigOptions.length;
            const indexList: number[] = newConfigOptions.map((item: {label: string, value: string, index: number}) => {
              return Number(item.label.replace('选项', '')) || item.index
            })
            const max = Math.max(...indexList)
            const label = `选项${max + 1}`
            newConfigOptions.push({ label: label, value: max + 1, index: max + 1 })
            handleChange(newConfigOptions, 'config.options')
            if (len === selectWidgetItem!.config!.maxLength){
              handleChange(newConfigOptions.length, 'config.maxLength')
            }
            handleChange(newConfigOptions, 'config.options')
          }}
        >
          添加选项
        </Button>
      </Form.Item>
      <Form.Item label="题目关联">
        <div className="related-click" onClick={() => {
          setIsModalOpen(true)
        }}>点击配置</div>
      </Form.Item>
      <Form.Item label="默认选择">
        <Select
          mode="multiple"
          fieldNames={{label: 'label', value: 'label'}}
          options={selectWidgetItem?.config?.options}
          value={selectWidgetItem?.config?.options.filter((it: any) => {
            return selectWidgetItem?.config?.defaultValueLabels.indexOf(it.label) !== -1
          }).map((it: any) => {
            return it.label
          })}
          onChange={(option) => {
            handleChange(option, 'config.defaultValueLabels')
            const valueList: string[] = [];
            selectWidgetItem?.config?.options.forEach((optionItem: any) => {
              if (option.indexOf(optionItem.label) !== -1){
                valueList.push(optionItem.value)
              }
            })

            widgetFormList.forEach((item: any, index) => {
              if (item.key === selectWidgetItem?.key){
                widgetFormList[index]!.config!.defaultValue = valueList
              }
            })
            getDefaultShowList()
            handleChange(valueList, 'config.defaultValue')
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
              min={1}
              value={selectWidgetItem?.config?.maxLength}
              onChange={(value) => handleChange(value, 'config.maxLength')}
            />
          }
        </Form.Item>
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

export default ImagePickerConfig
