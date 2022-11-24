import { useEffect, useState } from 'react';
import GlobalHeaderRight from '@/components/RightContent';
import PreviewModal from '@/pages/page_creat_manage/edit/components/PreviewModal';
import QRCode from 'qrcode.react'
import { Form, message, Radio, Popover } from 'antd';
import logo2 from '@/assets/page_creat_manage/logo2.png'
import successIcon from './img/success.png'
import previewIcon from './img/preview-icon.png'
import './index.less'
import { history } from '@@/core/history';
import { getTemplatePageInfo } from '@/services/page-creat-manage';

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

export default () => {
  const id = history.location.query?.id as string;
  const [publishType, setPublishType] = useState<string>("公开发布")
  const [templateJson, setTemplateJson] = useState<any>({})
  const [templateName, setTemplateName] = useState<string>('')
  const [previewVisible, setPreviewVisible] = useState(false)

  useEffect(() => {
    if (id){
      getTemplatePageInfo({
        id
      }).then((res) => {
        if (res?.code === 0 && res?.result?.tmpJson){
          setTemplateJson(JSON.parse(res?.result?.tmpJson))
          setTemplateName(res?.result?.tmpName)
        } else {
          message.error(res?.message)
        }
      })
    }
  }, [])

  const code = <QRCode
    value={`http://172.30.33.222/template-page?id=${id}&login=${publishType === '公开发布' ? '' : '1'}`}
    renderAs={'canvas'}
    size={122}
    bgColor={'#FFFFFF'}
    fgColor={'#000000'}
    level="H"
    includeMargin={true}
    imageSettings={{
      src: logo2,
      width: 25,
      height: 25,
      excavate: true,
    }}
  />
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
          <div className="page-name">{templateName}</div>
          <div className="preview-btn" onClick={() => {
            if(Object.keys(templateJson).length){
              setPreviewVisible(true)
            }
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
              <div className="link">{`http://172.30.33.222/template-page?id=${id}&login=${publishType === '公开发布' ? '' : '1'}`}</div>
              <div className="btn" onClick={() => {
                window.open(`http://172.30.33.222/template-page?id=${id}&login=${publishType === '公开发布' ? '' : '1'}`)
              }}>打开</div>
              <div className="line" />
              <div className="btn" onClick={() => {
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                navigator &&
                navigator.clipboard &&
                navigator.clipboard.writeText(`http://172.30.33.222/template-page?id=${id}&login=${publishType === '公开发布' ? '' : '1'}`).then(() => {
                  message.success('复制成功');
                });
              }}>复制</div>
              <div className="line" />
              <div className="btn">
                <Popover content={code} placement="bottomRight">
                  二维码
                </Popover>
              </div>
            </div>
          </div>
          <div className="link-info">
            <div className="title">web端</div>
            <div className="link-content">
              <div className="link">{`http://172.30.33.222/template-page?id=${id}&login=${publishType === '公开发布' ? '' : '1'}`}</div>
              <div className="btn"
                onClick={() => {
                  window.open(`http://172.30.33.222/template-page?id=${id}&login=${publishType === '公开发布' ? '' : '1'}`)
                }}
              >
                打开
              </div>
              <div className="line" />
              <div className="btn" onClick={() => {
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                navigator &&
                navigator.clipboard &&
                navigator.clipboard.writeText(`http://172.30.33.222/template-page?id=${id}&login=${publishType === '公开发布' ? '' : '1'}`).then(() => {
                  message.success('复制成功');
                });
              }}>复制</div>
              <div className="line" />
              <div className="btn">
                <Popover content={code} placement="bottomRight">
                  二维码
                </Popover>
              </div>
            </div>
          </div>
        </div>
      </div>
      <PreviewModal
        title="预览"
        footer={null}
        visible={previewVisible}
        json={templateJson}
        onCancel={() => {
          setPreviewVisible(false)
        }}
      />
    </div>
  )
}
