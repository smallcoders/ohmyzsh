/* eslint-disable */
import {  Form } from 'antd';
import { observer } from 'mobx-react'
import '../service-config-diagnose-manage.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useEffect, useState } from 'react';
import QuestionnaireTopicList from './questionnaire-topic-list'

const sc = scopedClasses('service-config-diagnose-manage');
export default observer(
    (props: {
      diagnoseRes: any
    }) => {
      const { questionAndAnswer = [] } = props || {}
      const [questionsForm] = Form.useForm()
      return (
        <div className={sc('container')}>
            <div className='preview-wrap'>
                <div className='web-preview'>
                <QuestionnaireTopicList topicTitle={'暂未设置问卷标题'} topicList={questionAndAnswer} form={questionsForm} />
                </div>
            </div>
        </div>
      );
    },
)
