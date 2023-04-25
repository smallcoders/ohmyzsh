import { useEffect, useState } from 'react';
import { message } from 'antd';
import { getTemplatePageInfo } from '@/services/page-creat-manage';
import ComponentItem from './ComponentItem';
import { history } from 'umi';
import './index.less'

export default () => {
  const id = history.location.query?.id as string;
  const [templateInfo, setTemplateInfo] = useState<any>(id ? null : JSON.parse(localStorage.getItem('appTmpInfo') || '{}'))
  useEffect(() => {
    if (id) {
      getTemplatePageInfo({
        id
      }).then((res) => {
        if (res?.code === 0 && res?.result?.tmpJson) {
          setTemplateInfo(res?.result)
        } else {
          message.error(res?.message)
        }
      })
    }
  }, [])
  const { tmpJson } = templateInfo || {}
  const json = JSON.parse(tmpJson || '{}')
  const widgetFormList = json.widgetFormList || []
  return (
    <div style={{
      height: '100%',
      width: '100%',
      background: '#cbe5be'
    }}>
      {/* json?.webGlobalConfig?.bgColor ? {background: json.webGlobalConfig.bgColor} : {} */}
      <div className="app-preview-page" style={{ background: '#fff' }}>
        {widgetFormList.map((widgetFormItem: any, index: number) => {
          return <ComponentItem item={widgetFormItem} key={index} />
        })}
      </div>
    </div>
  )

}

