import { FC, useContext, useMemo, useState } from 'react'
import { Form, Input, Checkbox, Popover, Radio, Tooltip } from 'antd';
import UploadForm from '../components/upload_form/upload-form';
import { DesignContext } from '../store'
import { ActionType } from '../store/action'
import questionIcon from '@/assets/page_creat_manage/question_icon.png';

const colorMapList = {
  bgColor: ["#CCDFFF","#DEE5FF","#BCDFFF","#0A309E","#D1EAFF"],
  btnBgColor: ["#CCDFFF","#DEE5FF","#BCDFFF","#0A309E","#D1EAFF"],
  textColor: ["#CCDFFF","#DEE5FF","#BCDFFF","#0A309E","#D1EAFF"]
}

const GlobalConfig: FC = () => {
  const {
    state: { globalConfig, formConfig },
    dispatch
  } = useContext(DesignContext)
  const [bgColorOpen, setBgColorOpen] = useState<boolean>(false)
  const [textColorOpen, setTextColorOpen] = useState<boolean>(false)
  const [buttonBgColorOpen, setButtonBgColorOpen] = useState<boolean>(false)


  const handleGlobalConfigChange = <T extends keyof typeof globalConfig>(fieldName: T, value: typeof globalConfig[T]) => {
    const action = {
      type: ActionType.SET_GLOBAL_CONFIG,
      payload: {
        ...globalConfig,
        [fieldName]: value
      }
    }
    dispatch(action)
  }

  const handleGlobalConfigListChange = (configs: any) => {
    const action = {
      type: ActionType.SET_GLOBAL_CONFIG,
      payload: {
        ...globalConfig,
        ...configs
      }
    }
    dispatch(action)
  }

  const content = (mapKey: string) => {
    return (
      <div className="color-card">
        <div className="color-card-value" style={{background: `${globalConfig?.[mapKey]}`}} />
        <div className="color-list">
          {
            colorMapList[mapKey].map((item: string, index: number) => {
              return (
                <div
                  onClick={() => {
                    if (mapKey === 'bgColor'){
                      setBgColorOpen(false)
                    }
                    if (mapKey === 'textColor'){
                      setTextColorOpen(false)
                    }
                    if (mapKey === 'btnBgColor'){
                      setTextColorOpen(false)
                    }
                    const inputKey = mapKey === 'bgColor' ? 'inputBgColor' : mapKey === 'textColor' ? 'inputTextColor' : 'inputBtnBgColor'
                    handleGlobalConfigListChange({
                      [mapKey]: item,
                      [inputKey]: item
                    })
                  }}
                  key={index}
                  style={{background: item}}
                  className="color-list-item"
                />
              )
            })
          }
        </div>
      </div>
    )
  }


  return (
    <>
      {useMemo(
        () => (
          <Form layout="vertical">
            <Form.Item label="表单名称" required >
              <Input
                maxLength={20}
                value={globalConfig?.pageName}
                onChange={(event) => handleGlobalConfigChange('pageName',event.target.value)}
                onBlur={(event) => {
                  if(!event.target.value){
                    handleGlobalConfigChange('pageName', '未命名表单')
                  }
                }}
              />
              <Checkbox checked={globalConfig?.showPageName} onChange={(e) => handleGlobalConfigChange('showPageName',e.target.checked)}>显示表单名称</Checkbox>
            </Form.Item>
            <Form.Item label="描述信息" >
              <Input maxLength={50} value={globalConfig?.pageDesc} onChange={(event) => handleGlobalConfigChange('pageDesc',event.target.value)} />
              <Checkbox checked={globalConfig?.showDesc} onChange={(e) => handleGlobalConfigChange('showDesc',e.target.checked)}>显示描述信息</Checkbox>
            </Form.Item>
            <Form.Item
              label={'表单样式'}
            >
              <Form.Item>
                <Radio.Group
                  defaultValue={globalConfig?.formStyle}
                  options={
                    [
                      {label: '题目分割（问卷类表单建议选择此样式）', value: 'split'},
                      {label: '题目平铺（活动类表单建议选择此样式）', value: 'tiled'},
                    ]
                  }
                  onChange={(e) => {
                    handleGlobalConfigChange('formStyle', e.target.value)
                  }}
                />
              </Form.Item>
            </Form.Item>
            <Form.Item label="表单背景" >
              <div className="config-item">
                <div className="config-item-label">头图:</div>
                <div>
                  <UploadForm
                    listType="picture-card"
                    className="avatar-uploader"
                    maxSize={1}
                    showUploadList={false}
                    accept=".bmp,.gif,.png,.jpeg,.jpg"
                    value={globalConfig?.pageBg}
                    onChange={(value: any) => {
                      handleGlobalConfigChange('pageBg', value?.path || value)
                    }}
                  />
                  <div className="upload-suggest">建议上传尺寸:{globalConfig?.formStyle === 'tiled' ? '1920 * 240' : '1500 * 480'}</div>
                </div>
              </div>
              <div className="config-item">
                <div className="config-item-label">背景底色:</div>
                <div className="flex">
                  <Popover
                    placement="topLeft"
                    overlayClassName="color-popover"
                    content={content('bgColor')}
                    trigger="click"
                    visible={bgColorOpen}
                    onVisibleChange={(newOpen: boolean) => {
                      setBgColorOpen(newOpen)
                    }}
                  >
                    <div className="show-color">
                      <span className="color" style={{background: `${globalConfig?.bgColor}`}} />
                      颜色
                    </div>
                  </Popover>
                  <div className="color-value">
                    <Form.Item>
                      <Input
                        maxLength={6}
                        value={globalConfig?.inputBgColor.replace('#', '')}
                        onChange={(e) => {
                          handleGlobalConfigChange('inputBgColor', `#${e.target.value.toUpperCase()}`)
                        }}
                        onBlur={(event) => {
                          const {value} = event.target
                          if(value && /^[0-9A-F]{6}$/i.test(value)){
                            handleGlobalConfigChange('bgColor', `#${value.toUpperCase()}`)
                          } else {
                            handleGlobalConfigChange('inputBgColor', globalConfig.bgColor)
                          }
                        }}
                      />
                    </Form.Item>
                    Hex
                  </div>
                </div>
              </div>
            </Form.Item>
            <Form.Item label="提交按钮" >
              <Input
                maxLength={6}
                value={globalConfig?.btnText}
                onChange={(event) => handleGlobalConfigChange('btnText',event.target.value)}
                onBlur={(event) => {
                  if(!event.target.value){
                    handleGlobalConfigChange('btnText', '提交')
                  }
                }}
              />
              <div className="config-item">
                <div className="config-item-label">字体颜色:</div>
                <div className="flex">
                  <Popover
                    placement="topLeft"
                    overlayClassName="color-popover"
                    content={content('textColor')}
                    trigger="click"
                    visible={textColorOpen}
                    onVisibleChange={(newOpen: boolean) => {
                      setTextColorOpen(newOpen)
                    }}
                  >
                    <div className="show-color" onClick={() => {
                      setTextColorOpen(true)
                    }}>
                      <span className="color" style={{background: `${globalConfig?.textColor}`}} />
                      颜色
                    </div>
                  </Popover>
                  <div className="color-value">
                    <Form.Item>
                      <Input
                        maxLength={6}
                        value={globalConfig?.inputTextColor.replace('#', '')}
                        onChange={(e) => {
                          handleGlobalConfigChange('inputTextColor', `#${e.target.value.toUpperCase()}`)
                        }}
                        onBlur={(event) => {
                          const {value} = event.target
                          if(value && /^[0-9A-F]{6}$/i.test(value)){
                            handleGlobalConfigChange('textColor', `#${value.toUpperCase()}`)
                          } else {
                            handleGlobalConfigChange('inputTextColor', globalConfig.textColor)
                          }
                        }}
                      />
                    </Form.Item>
                    Hex
                  </div>
                </div>
              </div>
              <div className="config-item">
                <div className="config-item-label">填充颜色:</div>
                <div className="flex">
                  <Popover
                    placement="topLeft"
                    overlayClassName="color-popover"
                    content={content('btnBgColor')}
                    trigger="click"
                    visible={buttonBgColorOpen}
                    onVisibleChange={(newOpen: boolean) => {
                      setButtonBgColorOpen(newOpen)
                    }}
                  >
                    <div className="show-color" onClick={() => {
                      setButtonBgColorOpen(true)
                    }}>
                      <span className="color" style={{background: `${globalConfig?.btnBgColor}`}} />
                      颜色
                    </div>
                  </Popover>
                  <div className="color-value">
                    <Form.Item>
                      <Input
                        maxLength={6}
                        value={globalConfig?.inputBtnBgColor.replace('#', '')}
                        onChange={(e) => {
                          handleGlobalConfigChange('inputBtnBgColor', `#${e.target.value.toUpperCase()}`)
                        }}
                        onBlur={(event) => {
                          const {value} = event.target
                          if(value && /^[0-9A-F]{6}$/i.test(value)){
                            handleGlobalConfigChange('btnBgColor', `#${value.toUpperCase()}`)
                          } else {
                            handleGlobalConfigChange('inputBtnBgColor', globalConfig.btnBgColor)
                          }
                        }}
                      />
                    </Form.Item>
                    Hex
                  </div>
                </div>
              </div>
            </Form.Item>
            <Form.Item label="附加条件" >
              <Checkbox
                checked={globalConfig.showRegister}
                onChange={(e) => {
                  handleGlobalConfigChange('showRegister', e.target.checked)
                }}
              >
                添加注册模块
                <Tooltip title="若勾选添加注册模块，发布链接请勿选择[对私发布]">
                  <img className="question-icon" src={questionIcon} alt='' />
                </Tooltip>
              </Checkbox>
            </Form.Item>
          </Form>
        ),
        [globalConfig, formConfig, bgColorOpen, buttonBgColorOpen, textColorOpen]
      )}
    </>
  )
}

export default GlobalConfig
