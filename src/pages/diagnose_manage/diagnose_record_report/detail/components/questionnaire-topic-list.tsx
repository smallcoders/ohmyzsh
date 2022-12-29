import React from 'react'
import { observer } from 'mobx-react'
import scopedClasses from '@/utils/scopedClasses'
import { Form, FormInstance } from 'antd'
import FormRadio from './questionnaire-form-radio'
import FormCheckbox from './questionnaire-form-checkbox'
import FormTextArea from './questionnaire-form-textarea'
import FormInput from './questionnaire-form-input'
import FormCascader from './questionnaire-form-cascader'

import './questionnaire-topic-list.less'
const sc = scopedClasses('questionnaire-topic-list')
enum TopicType {
  RADIO = 'radio',
  CHECKBOX = 'checkbox',
  TEXTAREA = 'textarea',
  INPUT = 'input',
  CASCADER = 'cascader',
}

export default observer(
  (props: {
    topicTitle: string
    submitTime: string
    topicList: object[]
    showAlphaCode?: boolean
    form?: FormInstance<any>
    onChange?: (record: any, value: any, index: number) => void
  }) => {
    const { topicList = [], form, showAlphaCode = false, onChange, topicTitle, submitTime } = props || {}

    const formItemDisplay = (item: any, index: number) => {
      let formItem = null
      switch (item.type) {
        case TopicType.RADIO: {
          formItem = (
            <FormRadio
              topicList={topicList}
              topicInfo={item}
              index={index}
              onChange={onChange}
              showAlphaCode={showAlphaCode}
            />
          )
          break
        }
        case TopicType.CHECKBOX: {
          formItem = (
            <FormCheckbox
              topicList={topicList}
              topicInfo={item}
              index={index}
              onChange={onChange}
              showAlphaCode={showAlphaCode}
            />
          )
          break
        }
        case TopicType.TEXTAREA: {
          formItem = (
            <FormTextArea
              topicList={topicList}
              topicInfo={item}
              index={index}
              onChange={onChange}
            />
          )
          break
        }
        case TopicType.INPUT: {
          formItem = (
            <FormInput topicList={topicList} topicInfo={item} index={index} onChange={onChange} />
          )
          break
        }
        case TopicType.CASCADER: {
          formItem = (
            <FormCascader
              topicList={topicList}
              topicInfo={item}
              index={index}
              onChange={onChange}
            />
          )
          break
        }
      }
      return formItem
    }

    return (
      <div className={sc('container')}>
        <h3 className='questionnaire-title'>{topicTitle} <span>诊断提交时间：{submitTime}</span></h3>
        <div className="content">
          <div className={sc('form')}>
            <Form layout="vertical" size="small" form={form} scrollToFirstError>
              {topicList?.map((item: any, index) => {
                return (
                  <div id={'topic-' + (index + 1)} key={item.id}>
                    {formItemDisplay(item, index)}
                  </div>
                )
              })}
            </Form>
          </div>
        </div>
      </div>
    )
  },
)
