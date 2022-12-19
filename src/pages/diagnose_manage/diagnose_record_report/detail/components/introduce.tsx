/* eslint-disable */
import {  Form } from 'antd';
import '../service-config-diagnose-manage.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useEffect, useState } from 'react';
import QuestionnaireTopicList from './questionnaire-topic-list'

const sc = scopedClasses('service-config-diagnose-manage');

const Introduce: React.FC = () => {
  const [diagnoseList, setDiagnoseList] = useState<any>([]);
  const [questionsForm] = Form.useForm()

  useEffect(() => {
    setDiagnoseList([
      {
          "name": "您的性别",
          "type": "radio",
          "required": true,
          "subTitle": "",
          "options": [
              {
                  "inputIsRequired": false,
                  "label": "男",
                  "allowInput": false
              },
              {
                  "inputIsRequired": false,
                  "label": "女",
                  "allowInput": false
              }
          ],
          "relations": [],
          "relatedRelation": "",
          "validate": null,
          "maxLength": null,
          "assignedProvince": null,
          "questionNo": "69900bb0c4794c24948f53a13c215c39",
          "isKey": false
      },
      {
          "name": "您的爱好",
          "type": "checkbox",
          "required": true,
          "subTitle": "",
          "options": [
              {
                  "inputIsRequired": false,
                  "label": "掼蛋",
                  "allowInput": false
              },
              {
                  "inputIsRequired": false,
                  "label": "麻将",
                  "allowInput": false
              },
              {
                  "inputIsRequired": false,
                  "label": "钓鱼",
                  "allowInput": false
              }
          ],
          "relations": [],
          "relatedRelation": "",
          "validate": null,
          "maxLength": null,
          "assignedProvince": null,
          "questionNo": "bf805fd843a24e469e10612006235b0b",
          "isKey": false
      },
      {
          "name": "您的住址",
          "type": "input",
          "required": true,
          "subTitle": "",
          "options": null,
          "relations": [
              {
                  "dependIndex": "0",
                  "dependValue": [
                      "男",
                      "女"
                  ]
              }
          ],
          "relatedRelation": null,
          "validate": 0,
          "maxLength": 50,
          "assignedProvince": null,
          "questionNo": "81dc420c00a14be88b00d0252f43780a",
          "isKey": false
      },
      {
          "name": "您的手机号",
          "type": "input",
          "required": true,
          "subTitle": "",
          "options": null,
          "relations": [
              {
                  "dependIndex": "1",
                  "dependValue": [
                      "掼蛋",
                      "麻将",
                      "钓鱼"
                  ]
              }
          ],
          "relatedRelation": null,
          "validate": 1,
          "maxLength": 50,
          "assignedProvince": null,
          "questionNo": "f17adf4fd8e24e51b8f180ceabe9e500",
          "isKey": false
      },
      {
          "name": "您所属的行政区划",
          "type": "cascader",
          "required": true,
          "subTitle": "",
          "options": null,
          "relations": [],
          "relatedRelation": "",
          "validate": null,
          "maxLength": null,
          "assignedProvince": "340000",
          "questionNo": "3fdad5e21a6345d3aba9b7fe9d5a20e3",
          "isKey": false
      },
      {
          "name": "您的预存款为？",
          "type": "input",
          "required": true,
          "subTitle": "",
          "options": null,
          "relations": [],
          "relatedRelation": "",
          "validate": 2,
          "maxLength": 50,
          "assignedProvince": null,
          "questionNo": "9e0c8268d53a49889448a62f9e8006a1",
          "isKey": false
      },
      {
          "name": "备注",
          "type": "textarea",
          "required": true,
          "subTitle": "",
          "options": null,
          "relations": [],
          "relatedRelation": "",
          "validate": 0,
          "maxLength": 200,
          "assignedProvince": null,
          "questionNo": "2c973173706e4fa6859aa864c1a65a12",
          "isKey": false
      },
      {
          "name": "题目标题8",
          "type": "radio",
          "required": true,
          "subTitle": "",
          "options": [
              {
                  "inputIsRequired": false,
                  "label": "1",
                  "allowInput": false
              },
              {
                  "inputIsRequired": false,
                  "label": "2",
                  "allowInput": false
              }
          ],
          "relations": [],
          "relatedRelation": "",
          "validate": null,
          "maxLength": null,
          "assignedProvince": null,
          "questionNo": "cc1dcbf02d7b47728c89255b4f079e82",
          "isKey": false
      }
  ])
  }, [])

  return (
    <div className={sc('container')}>
      <div className='preview-wrap'>
        <div className='web-preview'>
          <QuestionnaireTopicList topicTitle={'暂未设置问卷标题'} topicList={diagnoseList} form={questionsForm} />
        </div>
      </div>
    </div>
  );
};

export default Introduce;
