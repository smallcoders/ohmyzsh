import React, { useState } from 'react'
import { observer } from 'mobx-react'
import { Form, Radio, Input, Space } from 'antd'
import shouldUpdate from './should-update'

export default observer(
  (props: {
    topicList: any[]
    topicInfo: any
    index: number
    showAlphaCode: boolean
    onChange?: (record: any, value: any, index: number) => void
  }) => {
    const { topicList, topicInfo, index, showAlphaCode = false, onChange } = props || {}
    const { id, name, options, required, subTitle, related, relations, relatedRelation } = topicInfo
    const [value, setValue] = useState<string>('')

    const formItem = (
      <Form.Item label={`${index + 1}. ${name}`} required={required}>
        {subTitle && <div style={{ marginTop: '-20px', paddingBottom: '20px' }}>{subTitle}</div>}
        <Form.Item
          name={id}
          noStyle
          rules={[
            {
              required: required,
              message: '请输入',
            },
          ]}
        >
          <Radio.Group
            onChange={(e) => {
              setValue(e.target.value)
              onChange && onChange(topicInfo, e.target.value, index)
            }}
          >
            <Space direction="vertical" size={20}>
              {options?.map((option: any, jndex: number) => {
                return (
                  <Radio key={jndex} value={option?.label}>
                    {(showAlphaCode ? String.fromCharCode(65 + jndex) + ' ' : '') + option?.label}
                    {option?.allowInput && value === option?.label && (
                      <>
                        {option?.inputIsRequired && <span className="required-text"></span>}
                        <Form.Item
                          name={`${id}_###_${option?.label}`}
                          rules={[
                            {
                              required: option?.inputIsRequired,
                              message: '请输入',
                            },
                          ]}
                          style={{
                            display: 'inline-block',
                            marginBottom: 0,
                            paddingLeft: option?.inputIsRequired ? '0' : '15px',
                          }}
                        >
                          <Input style={{ width: 240 }} placeholder="请输入" />
                        </Form.Item>
                      </>
                    )}
                  </Radio>
                )
              })}
            </Space>
          </Radio.Group>
        </Form.Item>
      </Form.Item>
    )

    return relations?.length > 0 ? (
      <Form.Item shouldUpdate noStyle>
        {(form) => {
          const isTruth = shouldUpdate({
            formInstance: form,
            topicList: topicList || [],
            relations: relations || [],
            relatedRelation: relatedRelation || '',
          })
          return isTruth ? formItem : null
        }}
      </Form.Item>
    ) : (
      formItem
    )
  },
)
