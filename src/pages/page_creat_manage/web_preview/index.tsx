import { useState } from 'react';
import ComponentItem from './ComponentItem';
import './index.less'

export default () => {
  const [templateInfo] = useState<any>(JSON.parse(localStorage.getItem('tmpInfo') || '{}'))
  const { tmpJson } = templateInfo || {}
  const json = JSON.parse(tmpJson || '{}')
  const widgetFormList = json.widgetFormList || []
  return (
    <div className="web-preview-page" style={json?.webGlobalConfig?.bgColor ? {background: json.webGlobalConfig.bgColor} : {}}>
      {widgetFormList.map((widgetFormItem: any, index: number) => {
        return <ComponentItem item={widgetFormItem} key={index} />
      })}
    </div>
  )

}
