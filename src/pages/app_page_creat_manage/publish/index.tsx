import { useEffect, useState } from 'react';
import GlobalHeaderRight from '@/components/RightContent';
import QRCode from 'qrcode.react'
import { Form, message, Radio, Popover } from 'antd';
import logo2 from '@/assets/page_creat_manage/logo2.png'
import successIcon from '@/assets/page_creat_manage/success.png'
import logoImg from '@/assets/page_creat_manage/logo-img.png'
import { listAllAreaCode } from '@/services/common';
import previewIcon from '@/assets/page_creat_manage/preview-icon.png'
import './index.less'
import { history } from '@@/core/history';
import { getTemplatePageInfo } from '@/services/page-creat-manage';
import PreviewModal from '../edit/components/PreviewModal';
import { routeName } from '../../../../config/routes';

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

const hostMap = {
  'http://172.30.33.222:10086': 'http://172.30.33.222',
  'http://172.30.33.212:10086': 'http://172.30.33.212',
  'http://10.103.142.216': 'https://preprod.lingyangplat.com',
  'http://manage.lingyangplat.com': 'https://www.lingyangplat.com',
  'https://manage.lingyangplat.com': 'https://www.lingyangplat.com',
  'http://localhost:8000': 'http://172.30.33.222'
}

export default () => {
  const id = history.location.query?.id as string;
  const [publishType, setPublishType] = useState<string>("公开发布")
  const [templateJson, setTemplateJson] = useState<any>({})
  const [templateInfo, setTemplateInfo] = useState<any>({})
  const [areaCodeOptions, setAreaCodeOptions] = useState<any>({county: [], city: [], province: []})
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
          setTemplateInfo(res?.result)
        } else {
          message.error(res?.message)
        }
      })
      listAllAreaCode().then((res) => {
        if (res?.result){
          const {result} = res
          const city: any = []
          const province: any = []
          result.forEach((item: any) => {
            city.push({
              ...item,
              nodes: item.nodes?.map((node: any) => {
                const {nodes, ...reset} = node
                return reset
              })
            })
            const {nodes, ...reset} = item
            province.push(reset)
          })
          setAreaCodeOptions({
            county: result,
            city,
            province
          })
        }
      })
    }
  }, [])

  const getLink = (isMobile: boolean) => {
    const { origin } = window.location
    if (isMobile){
      return `${hostMap[origin]}/antelope-activity-h5/template-page/index.html#/?isApp=false&id=${id}&login=${publishType === '公开发布' ? '' : '1'}&timeStamp=${+new Date()}`
    } else {
      return `${hostMap[origin]}/front/template-page?id=${id}&login=${publishType === '公开发布' ? '' : '1'}&timeStamp=${+new Date()}`
    }
  }

  const getCode = (isMobile: boolean) => {
    return (
      <div>
        <div style={{display: 'none'}}>
          <QRCode
            value={getLink(isMobile)}
            renderAs={'canvas'}
            size={400}
            bgColor={'#FFFFFF'}
            fgColor={'#000000'}
            level="H"
            id="download-canvas"
            includeMargin={true}
            imageSettings={{
              src: logo2,
              width: 50,
              height: 50,
              excavate: true,
            }}
          />
        </div>
        <QRCode
          value={getLink(isMobile)}
          renderAs={'canvas'}
          size={122}
          bgColor={'#FFFFFF'}
          fgColor={'#000000'}
          level="H"
          id="canvas"
          includeMargin={true}
          imageSettings={{
            src: logo2,
            width: 25,
            height: 25,
            excavate: true,
          }}
        />
        <div className="download-btn"
             onClick={() => {
               const canvas: any = document.querySelector('#download-canvas');
               // 创建一个 a 标签，并设置 href 和 download 属性
               const el = document.createElement('a');
               // 设置 href 为图片经过 base64 编码后的字符串，默认为 png 格式
               el.href = canvas.toDataURL();
               el.download = `${templateName}-${publishType}-${isMobile? '移动端': 'web端'}`;
               // 创建一个点击事件并对 a 标签进行触发
               const event = new MouseEvent('click');
               el.dispatchEvent(event);
             }}
        >
          下载
        </div>
      </div>
    )
  }

  return (
    <div className="publish-page">
      <div className="top-header">
        <div className="top-header-right" onClick={() => {
          history.push('/');
        }}>
          <img src={logoImg} alt='' />
          <span>羚羊运营平台</span>
        </div>
        <GlobalHeaderRight />
      </div>
      <div className="middle-header">
        <div className="left">
          <div className="page-name">{templateName}</div>
          <div className="preview-btn" onClick={() => {
            if(Object.keys(templateJson).length){
              if (templateInfo.tmpType !== 1){
                setPreviewVisible(true)
              } else {
                window.open(`${routeName.PAGE_CREAT_MANAGE_WEB_PREVIEW}?id=${templateInfo.tmpId || ''}&type=${templateInfo.tmpType || ''}`);
              }
            }
          }}>
            <img src={previewIcon} alt='' /><span>预览</span>
          </div>
        </div>
        <div className="title">{templateInfo.tmpType === 1 ? '网页' : '表单'}发布</div>
      </div>
      <div className="content">
        <div className="result-content">
          <div className="status"><img src={successIcon} alt='' />{templateInfo.tmpType === 1 ? '网页' : '表单'}已发布</div>
          <div className="desc">可在运营模板配置列表对表单进行管理</div>
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
              publishType === '公开发布' ? `使用此方式发布${templateInfo.tmpType === 1 ? '网页' : '表单'}，访问时不需要登录` : `使用此方法发布${templateInfo.tmpType === 1 ? '网页' : '表单'}，访问时需要登录羚羊平台账号`
            }
          </div>
          {
            templateInfo.tmpType !== 1 &&
            <div className="link-info">
              <div className="title">移动端</div>
              <div className="link-content">
                <div className="link" id="mobile-link">{getLink(true)}</div>
                <div className="btn" onClick={() => {
                  const range = document.createRange();
                  range.selectNode(document.getElementById('mobile-link')!);
                  const selection: any = window.getSelection();
                  if (selection.rangeCount > 0) selection.removeAllRanges();
                  selection.addRange(range);
                  document.execCommand('copy');
                  message.success('复制成功');
                  selection.removeRange(range);
                }}>复制</div>
                <div className="line" />
                <div className="btn">
                  <Popover trigger="click" content={getCode(true)} placement="bottomRight">
                    二维码
                  </Popover>
                </div>
              </div>
            </div>
          }
          <div className="link-info">
            <div className="title">web端</div>
            <div className="link-content">
              <div className="link" id="pc-link">{getLink(false)}</div>
              <div className="btn"
                   onClick={() => {
                     window.open(getLink(false))
                   }}
              >
                打开
              </div>
              <div className="line" />
              <div className="btn" onClick={() => {
                const range = document.createRange();
                range.selectNode(document.getElementById('pc-link')!);
                const selection: any = window.getSelection();
                if (selection.rangeCount > 0) selection.removeAllRanges();
                selection.addRange(range);
                document.execCommand('copy');
                message.success('复制成功');
                selection.removeRange(range);
              }}>复制</div>
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
        areaCodeOptions={areaCodeOptions}
      />
    </div>
  )
}
