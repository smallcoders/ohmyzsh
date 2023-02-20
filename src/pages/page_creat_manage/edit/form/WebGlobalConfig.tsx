import { FC, useContext, useMemo, useState } from 'react'
import { Form, Input, Popover } from 'antd';
import { DesignContext } from '../store'
import { ActionType } from '../store/action'

const colorMapList = ["#CCDFFF","#DEE5FF","#BCDFFF","#0A309E","#D1EAFF"]

const GlobalConfig: FC = () => {
  const {
    state: { webGlobalConfig },
    dispatch
  } = useContext(DesignContext)
  const [bgColorOpen, setBgColorOpen] = useState<boolean>(false)


  const handleGlobalConfigChange = <T extends keyof typeof webGlobalConfig>(fieldName: T, value: typeof webGlobalConfig[T]) => {
    const action = {
      type: ActionType.SET_WEB_GLOBAL_CONFIG,
      payload: {
        ...webGlobalConfig,
        [fieldName]: value
      }
    }
    dispatch(action)
  }
  const handleGlobalConfigListChange = (configs: any) => {
    const action = {
      type: ActionType.SET_WEB_GLOBAL_CONFIG,
      payload: {
        ...webGlobalConfig,
        ...configs
      }
    }
    dispatch(action)
  }

  const content = () => {
    return (
      <div className="color-card">
        <div className="color-card-value" style={{background: `${webGlobalConfig?.bgColor}`}} />
        <div className="color-list">
          {
            colorMapList.map((item: string, index: number) => {
              return (
                <div
                  onClick={() => {
                    setBgColorOpen(false)
                    handleGlobalConfigListChange({
                      bgColor: item,
                      inputBgColor: item
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
            <Form.Item label="网页名称" required >
              <Input
                maxLength={20}
                value={webGlobalConfig?.pageName}
                onChange={(event) => handleGlobalConfigChange('pageName',event.target.value)}
                onBlur={(event) => {
                  if(!event.target.value){
                    handleGlobalConfigChange('pageName', '未命名网页')
                  }
                }}
              />
            </Form.Item>
            <Form.Item label="描述信息" >
              <Input.TextArea maxLength={50} value={webGlobalConfig?.pageDesc} onChange={(event) => handleGlobalConfigChange('pageDesc',event.target.value)} />
            </Form.Item>
            <Form.Item label="表单背景" >
              <div className="config-item">
                <div className="config-item-label">网页背景:</div>
                <div className="flex">
                  <Popover
                    placement="topLeft"
                    overlayClassName="color-popover"
                    content={content()}
                    trigger="click"
                    visible={bgColorOpen}
                    onVisibleChange={(newOpen: boolean) => {
                      setBgColorOpen(newOpen)
                    }}
                  >
                    <div className="show-color">
                      <span className="color" style={{background: `${webGlobalConfig?.bgColor}`}} />
                      颜色
                    </div>
                  </Popover>
                  <div className="color-value">
                    <Form.Item>
                      <Input
                        maxLength={6}
                        value={webGlobalConfig?.inputBgColor.replace('#', '')}
                        onChange={(e) => {
                          handleGlobalConfigChange('inputBgColor', `#${e.target.value.toUpperCase()}`)
                        }}
                        onBlur={(event) => {
                          const {value} = event.target
                          if(value && /^[0-9A-F]{6}$/i.test(value)){
                            handleGlobalConfigChange('bgColor', `#${value.toUpperCase()}`)
                          } else {
                            handleGlobalConfigChange('inputBgColor', webGlobalConfig.bgColor)
                          }
                        }}
                      />
                    </Form.Item>
                    Hex
                  </div>
                </div>
              </div>
            </Form.Item>
          </Form>
        ),
        [webGlobalConfig, bgColorOpen]
      )}
    </>
  )
}

export default GlobalConfig
