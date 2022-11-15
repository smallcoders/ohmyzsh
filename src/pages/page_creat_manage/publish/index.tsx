import React, {useState} from 'react';
import GlobalHeaderRight from '@/components/RightContent';
import PreviewModal from '@/pages/page_creat_manage/edit/components/PreviewModal';
import successIcon from './img/success.png'
import previewIcon from './img/preview-icon.png'
import './index.less'
import { Form, Radio } from 'antd';

const publishOptions = [
  {
    label: "公开发布",
    value: "公开发布"
  },
  {
    label: "对平台成员发布",
    value: "对平台成员发布"
  },
]


const mock = {
  "selectWidgetItem": {
    "label": "多选框组",
    "type": "CheckboxGroup",
    "config": {
      "options": [
        {
          "label": "选项1",
          "value": "选项1"
        },
        {
          "label": "选项2",
          "value": "选项2"
        },
        {
          "label": "选项3",
          "value": "选项3"
        }
      ],
      "required": false,
      "maxLength": 3,
      "defaultValue": [],
      "desc": "",
      "paramsKey": "",
      "isParam": true,
      "paramDesc": "",
      "paramType": "",
      "showLabel": true
    },
    "key": "CheckboxGroup_27c5b4fd6876429d8a249cf82a0c3686"
  },
  "widgetFormList": [
    {
      "label": "输入框",
      "type": "Input",
      "config": {
        "allowClear": true,
        "maxLength": 35,
        "required": false,
        "paramKey": "",
        "desc": "",
        "isParam": true,
        "paramDesc": "",
        "paramType": "string",
        "showLabel": true,
        "unRepeat": false
      },
      "key": "Input_eba35b713b4d4068881fd4109615482a"
    },
    {
      "label": "输入框",
      "type": "Input",
      "config": {
        "allowClear": true,
        "maxLength": 35,
        "required": false,
        "paramKey": "",
        "desc": "",
        "isParam": true,
        "paramDesc": "",
        "paramType": "string",
        "showLabel": true,
        "unRepeat": false
      },
      "key": "Input_f26e4446680a4d3898006126d803e5ef"
    },
    {
      "label": "多选框组",
      "type": "CheckboxGroup",
      "config": {
        "options": [
          {
            "label": "选项1",
            "value": "选项1"
          },
          {
            "label": "选项2",
            "value": "选项2"
          },
          {
            "label": "选项3",
            "value": "选项3"
          }
        ],
        "required": false,
        "maxLength": 3,
        "defaultValue": [],
        "desc": "",
        "paramsKey": "",
        "isParam": true,
        "paramDesc": "",
        "paramType": "",
        "showLabel": true
      },
      "key": "CheckboxGroup_27c5b4fd6876429d8a249cf82a0c3686"
    }
  ],
  "globalConfig": {
    "pageName": "未命名表单",
    "pageDesc": "",
    "pageBg": "",
    "showPageName": true,
    "showDesc": true,
    "btnText": "提交"
  },
  "formConfig": {
    "colon": true,
    "labelAlign": "right",
    "layout": "vertical"
  }
}

export default () => {
  const [publishType, setPublishType] = useState<string>("公开发布")
  const [previewVisible, setPreviewVisible] = useState(false)
  return (
    <div className="publish-page">
      <div className="top-header">
        <div className="top-header-right">
          羚羊工业平台
        </div>
        <GlobalHeaderRight />
      </div>
      <div className="middle-header">
        <div className="left">
          <div className="page-name">表单名称</div>
          <div className="preview-btn" onClick={() => {
            setPreviewVisible(true)
          }}>
            <img src={previewIcon} alt='' />预览
          </div>
        </div>
        <div className="title">表单发布</div>
      </div>
      <div className="content">
        <div className="result-content">
          <div className="status"><img src={successIcon} alt='' />表单已发布</div>
          <div className="desc">可在运营模版配置列表对表单进行管理</div>
        </div>
        <div className="main-content">
          <Form.Item>
            <Radio.Group
              optionType="button"
              buttonStyle="solid"
              value={publishType}
              options={publishOptions}
              onChange={(event) => setPublishType(event.target.value)}
            />
          </Form.Item>
          <div className="publish-type-desc">
            {
              publishType === '公开发布' ? "使用此方式发布表单，访问时不需要登录" : "使用此方法发布表单，访问时需要登录羚羊平台账号"
            }
          </div>
          <div className="link-info">
            <div className="title">移动端</div>
            <div className="link-content">
              <div className="link">https:www.baidu.com</div>
              <div className="btn">打开</div>
              <div className="line" />
              <div className="btn">复制</div>
              <div className="line" />
              <div className="btn">二维码</div>
            </div>
          </div>
          <div className="link-info">
            <div className="title">web端</div>
            <div className="link-content">
              <div className="link">https:www.baidu.com</div>
              <div className="btn">打开</div>
              <div className="line" />
              <div className="btn">复制</div>
              <div className="line" />
              <div className="btn">二维码</div>
            </div>
          </div>
        </div>
      </div>
      <PreviewModal
        title="预览"
        width="100%"
        style={{
          height: '100%',
          maxWidth: '100%',
          top: 0,
          padding: 0
        }}
        bodyStyle={{
          minHeight: 'calc(100vh - 48px)',
        }}
        footer={null}
        visible={previewVisible}
        json={mock}
        onCancel={() => {
          setPreviewVisible(false)
        }}
      />
    </div>
  )
}
