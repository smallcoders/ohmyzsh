import React from 'react'
import { observer } from 'mobx-react'
import { Form, Input } from 'antd'
// 正则
// import { phoneVerifyReg, decimalsVerifyReg } from '@/utils/regex-util'
import shouldUpdate from './should-update'
import { Item } from 'rc-menu'

export default observer(
  (props: {
    topicList: any[]
    topicInfo: any
    index: number
    onChange?: (record: any, value: any, index: number) => void
  }) => {
    const { topicList, topicInfo, index, onChange } = props || {}
    const { id, name, minLength, maxLength, required, validate, subTitle, related, relations, relatedRelation } = topicInfo

    const rules = []
    required &&
      rules.push({
        required: true,
        message: '请输入',
      })

    validate == 1 &&
      rules.push({
        pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
        message: '请输入正确格式的手机号码',
      })
    validate == 2 &&
      rules.push({
        pattern: /^(([1-9]{1}\d{0,7})|(0{1}))(\.\d{1,2})?$/,
        message: '请输入数值，可精确到小数点后两位',
      })

    const formItem = (
      <Form.Item label={`${index + 1}. ${name}`} required={required}>
        {subTitle && <div style={{ marginTop: '-20px', paddingBottom: '20px' }}>{subTitle}</div>}
        <Form.Item name={id} rules={rules} noStyle>
          <Input
            onChange={(e) => {
              onChange && onChange(topicInfo, e, index)
            }}
            minLength={minLength}
            maxLength={maxLength}
            placeholder="请输入"
            value={topicInfo.answer}
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
