import { FC, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, Form, Input, Popover } from 'antd';
import { DesignContext } from '../store'
import { ActionType } from '../store/action'
import moment from 'moment';

const colorMapList = ["#CCDFFF", "#DEE5FF", "#BCDFFF", "#0A309E", "#D1EAFF"]

const GlobalConfig: FC = () => {
  const {
    state: { webGlobalConfig },
    dispatch
  } = useContext(DesignContext)
  const [bgColorOpen, setBgColorOpen] = useState<boolean>(false)
  const inputRef = useRef<any>(null);
  useEffect(() => {
    if (inputRef?.current) {
      inputRef.current.focus()
    }
  }, [])


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
        <div className="color-card-value" style={{ background: `${webGlobalConfig?.bgColor}` }} />
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
                  style={{ background: item }}
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
            <Form.Item label="活动模版名称" required >
              <Input
                maxLength={8}
                ref={inputRef}
                onFocus={() => {
                  inputRef.current?.select()
                }}
                value={webGlobalConfig?.pageName}
                onChange={(event) => handleGlobalConfigChange('pageName', event.target.value)}
                onBlur={(event) => {
                  if (!event.target.value) {
                    handleGlobalConfigChange('pageName', '未命名模版')
                  }
                }}
              />
            </Form.Item>
            <Form.Item label="活动时间" required>
              <DatePicker.RangePicker
                disabledDate={(current) => {
                  return current && current < moment().startOf('day');
                }}
                value={webGlobalConfig?.activeTime ? [moment(webGlobalConfig?.activeTime?.[0]), moment(webGlobalConfig?.activeTime?.[1])] : undefined}
                format={'YYYY-MM-DD'} onChange={(event) => handleGlobalConfigChange('activeTime', [event[0].format('YYYY-MM-DD 00:00:00'), event[1].format('YYYY-MM-DD 00:00:00')])} />
            </Form.Item>

            {/* <Form.Item label="描述信息" >
              <Input.TextArea maxLength={50} value={webGlobalConfig?.pageDesc} onChange={(event) => handleGlobalConfigChange('pageDesc', event.target.value)} />
            </Form.Item> */}

            {/* <Form.Item label="网页背景" >
              <div className="config-item">
                <div className="config-item-label">背景底色:</div>
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
                      <span className="color" style={{ background: `${webGlobalConfig?.bgColor}` }} />
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
                          const { value } = event.target
                          if (value && /^[0-9A-F]{6}$/i.test(value)) {
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
            </Form.Item> */}
          </Form>
        ),
        [webGlobalConfig, bgColorOpen]
      )}
    </>
  )
}

export default GlobalConfig
