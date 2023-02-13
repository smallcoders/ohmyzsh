import { useState } from 'react';
import { Form, Input, Popover } from 'antd';
import { useConfig } from '../hooks/hooks'

const colorMapList = ["#CCDFFF","#DEE5FF","#BCDFFF","#0A309E","#D1EAFF"]

const TextConfig = () => {
  const { selectWidgetItem, handleChange } = useConfig()
  const { config } = selectWidgetItem || {}
  const [textColorOpen, setTextColorOpen] = useState<boolean>(false)

  const content = () => {
    return (
      <div className="color-card">
        <div className="color-card-value" style={{background: `${config?.color}`}} />
        <div className="color-list">
          {
            colorMapList.map((item: string, index: number) => {
              return (
                <div
                  onClick={() => {
                    setTextColorOpen(false)
                    handleChange(item, 'color')
                    handleChange(item, 'inputColor')
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
      <Form.Item label="文本内容" required>
        <Input.TextArea maxLength={300} value={config?.text} onChange={(event) => handleChange(event.target.value, 'config.children')} />
      </Form.Item>
      <Form.Item label="文本样式">
        <div className="text-style">
          <div className="text-style-item">标题</div>
          <div className="text-style-item">副标题</div>
          <div className="text-style-item">正文</div>
        </div>
      </Form.Item>
      <Form.Item label="排版">
        <div className="config-item">
          <div className="config-item-label">字体颜色:</div>
          <div className="flex">
            <Popover
              placement="topLeft"
              overlayClassName="color-popover"
              content={content()}
              trigger="click"
              visible={textColorOpen}
              onVisibleChange={(newOpen: boolean) => {
                setTextColorOpen(newOpen)
              }}
            >
              <div className="show-color" onClick={() => {
                setTextColorOpen(true)
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
                    handleChange('inputColor', `#${e.target.value.toUpperCase()}`)
                  }}
                  onBlur={(event) => {
                    const {value} = event.target
                    if(value && /^[0-9A-F]{6}$/i.test(value)){
                      handleChange('textColor', `#${value.toUpperCase()}`)
                    } else {
                      handleChange('inputTextColor', config?.textColor)
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
          <div className="flex">

          </div>
        </div>
      </Form.Item>
    </>
  )
}

export default TextConfig
