/* eslint-disable */
import {  Form, Image } from 'antd';
import { observer } from 'mobx-react'
import '../service-config-diagnose-manage.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useEffect, useState } from 'react';
import QuestionnaireTopicList from './questionnaire-topic-list'
import icon1 from '@/assets/system/empty.png';

const sc = scopedClasses('service-config-diagnose-manage');
export default observer(
    (props: {
      diagnoseRes: any
    }) => {
      const { questionAndAnswer = [] } = props || {}
      console.log(questionAndAnswer, '-----questionAndAnswer')
      const [questionsForm] = Form.useForm()
      return (
        <div className={sc('container')}>
          {questionAndAnswer && questionAndAnswer.length > 0 ? (
            <div className='preview-wrap'>
              <div className='web-preview'>
                <QuestionnaireTopicList topicTitle={'暂未设置问卷标题'} topicList={questionAndAnswer} form={questionsForm} />
              </div>
            </div>
          ) : (
            <div className="empty-status">
              <Image src={icon1} width={160} />
              <p>暂无数据</p>
            </div>
          )}
        </div>
      );
    },
)
