import React from 'react'
import { observer } from 'mobx-react'
import { Form, Input } from 'antd'
import shouldUpdate from './should-update'

export default observer(
  (props: {
    topicList: any[]
    topicInfo: any
    index: number
    onChange?: (record: any, value: any, index: number) => void
  }) => {
    const { topicList, topicInfo, index, onChange } = props || {}
    const { id, name, minLength, maxLength, required, subTitle, related, relations, relatedRelation } = topicInfo

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
          <Input.TextArea
            onChange={(e) => {
              onChange && onChange(topicInfo, e, index)
            }}
            rows={4}
            showCount
            minLength={minLength}
            maxLength={maxLength}
            placeholder="请输入"
          />
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
