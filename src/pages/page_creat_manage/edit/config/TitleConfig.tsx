import { useState, useEffect, useRef } from 'react';
import { Form, Input, InputNumber, Popover, Select, Tooltip } from 'antd';
import { useConfig } from '../hooks/hooks'
export const fontWeightOptions = [
  {
    label: "Regular",
    value: "normal",
  },
  {
    label: "Bold",
    value: "bold",
  }
]

const colorMapList = ["#1E232A","#556377","#8290A6","#C4CAD5","#0068FF"]

const TitleConfig = () => {
  const { selectWidgetItem, handleChange } = useConfig()

  const inputRef = useRef<any>(null);
  useEffect(() => {
    if (inputRef?.current){
      inputRef.current.focus()
    }
  }, [])
  const { config } = selectWidgetItem || {}
  const [titleColorOpen, setTitleColorOpen] = useState<boolean>(false)
  const [subTitleColorOpen, setSubTitleColorOpen] = useState<boolean>(false)

  const content = (type: string) => {
    return (
      <div className="color-card">
        <div className="color-card-value" style={{background: `${type === 'subTitle' ? config?.subTitle.color : config?.color}`}} />
        <div className="color-list">
          {
            colorMapList.map((item: string, index: number) => {
              return (
                <div
                  onClick={() => {
                    if(type === 'subTitle'){
                      setSubTitleColorOpen(false)
                      handleChange(item, 'config.subTitle.color')
                      handleChange(item, 'config.subTitle.inputColor')
                    } else {
                      setTitleColorOpen(false)
                      handleChange(item, 'config.color')
                      handleChange(item, 'config.inputColor')
                    }
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
      <Form.Item label="主标题内容" required>
        <Input.TextArea
          onFocus={() => {
            inputRef.current?.resizableTextArea.textArea.select()
          }}
          ref={inputRef}
          maxLength={300}
          value={config?.text}
          onChange={(event) => handleChange(event.target.value, 'config.text')}
        />
      </Form.Item>
      <Form.Item label="排版">
        <div className="config-item">
          <div className="config-item-label">字符:</div>
          <div className="flex special-style">
            <Select
              options={fontWeightOptions}
              value={config?.fontWeight}
              onChange={(value) => {
                handleChange(value, 'config.fontWeight')
              }}
            />
            <InputNumber
              value={config?.fontSize}
              max={48}
              min={12}
              onChange={(value) => handleChange(value, 'config.fontSize')}
            />
          </div>
        </div>
        <div className="config-item">
          <div className="config-item-label">字体颜色:</div>
          <div className="flex">
            <Popover
              placement="topLeft"
              overlayClassName="color-popover"
              content={content('title')}
              trigger="click"
              visible={titleColorOpen}
              onVisibleChange={(newOpen: boolean) => {
                setTitleColorOpen(newOpen)
              }}
            >
              <div className="show-color" onClick={() => {
                setTitleColorOpen(true)
              }}>
                <span className="color" style={{background: `${config?.color}`}} />
                颜色
              </div>
            </Popover>
            <div className="color-value">
              <Form.Item>
                <Input
                  maxLength={6}
                  value={config?.inputColor?.replace('#', '')}
                  onChange={(e) => {
                    handleChange(`#${e.target.value.toUpperCase()}`, 'config.inputColor' )
                  }}
                  onBlur={(event) => {
                    const {value} = event.target
                    if(value && /^[0-9A-F]{6}$/i.test(value)){
                      handleChange(`#${value.toUpperCase()}`, 'config.color')
                    } else {
                      handleChange(config?.color,'config.inputColor')
                    }
                  }}
                />
              </Form.Item>
              Hex
            </div>
          </div>
        </div>
        <div className="config-item">
          <div className="config-item-label">对齐方式:</div>
          <div className="flex align">
            <Tooltip title="左对齐" placement="bottomLeft">
              <div
                className={config?.textAlign === 'left' ? 'left active' : 'left'}
                onClick={() => {
                  handleChange('left', 'config.textAlign')
                }}
              />
            </Tooltip>
            <Tooltip title="居中对齐" placement="bottomLeft">
              <div
                className={config?.textAlign === 'center' ? 'center active' : 'center'}
                onClick={() => {
                  handleChange('center', 'config.textAlign')
                }}
              />
            </Tooltip>
            <Tooltip title="右对齐" placement="bottomLeft">
              <div
                className={config?.textAlign === 'right' ? 'right active' : 'right'}
                onClick={() => {
                  handleChange('right', 'config.textAlign')
                }}
              />
            </Tooltip>
            <Tooltip title="两端对齐" placement="bottomLeft">
              <div
                className={config?.textAlign === 'justifyAlign' ? 'justify-align active' : 'justify-align'}
                onClick={() => {
                  handleChange('justifyAlign', 'config.textAlign')
                }}
              />
            </Tooltip>
          </div>
        </div>
      </Form.Item>
      <Form.Item label="副标题内容">
        <Input.TextArea
          maxLength={300}
          value={config?.subTitle?.text}
          onBlur={(event) => {
            if (!event.target.value){
              handleChange(24, 'config.paddingBottom')
            } else {
              handleChange(0, 'config.paddingBottom')
            }
          }}
          onChange={(event) => handleChange(event.target.value, 'config.subTitle.text')}
        />
      </Form.Item>
      <Form.Item label="排版">
        <div className="config-item">
          <div className="config-item-label">字符:</div>
          <div className="flex special-style">
            <Select
              options={fontWeightOptions}
              value={config?.subTitle.fontWeight}
              onChange={(value) => {
                handleChange(value, 'config.subTitle.fontWeight')
              }}
            />
            <InputNumber
              value={config?.subTitle.fontSize}
              max={48}
              min={12}
              onChange={(value) => handleChange(value, 'config.subTitle.fontSize')}
            />
          </div>
        </div>
        <div className="config-item">
          <div className="config-item-label">字体颜色:</div>
          <div className="flex">
            <Popover
              placement="topLeft"
              overlayClassName="color-popover"
              content={content('subTitle')}
              trigger="click"
              visible={subTitleColorOpen}
              onVisibleChange={(newOpen: boolean) => {
                setSubTitleColorOpen(newOpen)
              }}
            >
              <div className="show-color" onClick={() => {
                setSubTitleColorOpen(true)
              }}>
                <span className="color" style={{background: `${config?.subTitle?.color}`}} />
                颜色
              </div>
            </Popover>
            <div className="color-value">
              <Form.Item>
                <Input
                  maxLength={6}
                  value={config?.subTitle?.inputColor?.replace('#', '')}
                  onChange={(e) => {
                    handleChange(`#${e.target.value.toUpperCase()}`, 'config.subTitle.inputColor' )
                  }}
                  onBlur={(event) => {
                    const {value} = event.target
                    if(value && /^[0-9A-F]{6}$/i.test(value)){
                      handleChange(`#${value.toUpperCase()}`, 'config.subTitle.color')
                    } else {
                      handleChange(config?.color,'config.subTitle.inputColor')
                    }
                  }}
                />
              </Form.Item>
              Hex
            </div>
          </div>
        </div>
        <div className="config-item">
          <div className="config-item-label">对齐方式:</div>
          <div className="flex align">
            <Tooltip title="左对齐" placement="bottomLeft">
              <div
                className={config?.textAlign === 'left' ? 'left active' : 'left'}
                onClick={() => {
                  handleChange('left', 'config.textAlign')
                }}
              />
            </Tooltip>
            <Tooltip title="居中对齐" placement="bottomLeft">
              <div
                className={config?.textAlign === 'center' ? 'center active' : 'center'}
                onClick={() => {
                  handleChange('center', 'config.textAlign')
                }}
              />
            </Tooltip>
            <Tooltip title="右对齐" placement="bottomLeft">
              <div
                className={config?.textAlign === 'right' ? 'right active' : 'right'}
                onClick={() => {
                  handleChange('right', 'config.textAlign')
                }}
              />
            </Tooltip>
            <Tooltip title="两端对齐" placement="bottomLeft">
              <div
                className={config?.textAlign === 'justifyAlign' ? 'justify-align active' : 'justify-align'}
                onClick={() => {
                  handleChange('justifyAlign', 'config.textAlign')
                }}
              />
            </Tooltip>
          </div>
        </div>
      </Form.Item>
    </>
  )
}

export default TitleConfig
