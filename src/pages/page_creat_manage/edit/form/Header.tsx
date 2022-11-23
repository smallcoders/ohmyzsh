import { useState, MouseEvent, FC, useContext } from 'react';
import { Layout, message, Space } from 'antd';
import {saveTemplate} from '@/services/page-creat-manage'
import PreviewModal from '../components/PreviewModal'
import GenerateJsonModal from '../components/GenerateJsonModal'
import { useConfig } from '../hooks/hooks'
import { ActionType } from '../store/action'
import type { DesignFormProps } from './index'
import { DesignContext } from '../store'
const Header: FC<DesignFormProps> = (props) => {
  const { preview } = props
  const { state } = useContext(DesignContext)
  const { handlerSetVisible, dispatch } = useConfig()
  const [previewVisible, setPreviewVisible] = useState(false)
  const [generateJsonVisible, setGenerateJsonVisible] = useState(false)

  const handleClear = (event: MouseEvent) => {
    event.preventDefault()
    dispatch({
      type: ActionType.SET_WIDGET_FORM_LIST,
      payload: []
    })
  }

  const handleSave = () => {
    const { widgetFormList, globalConfig } =  state;
    const paramsList: any = []
    const paramsKeyList: string[] = []
    if (widgetFormList.length){
      widgetFormList.forEach((item) => {
        if (item?.config?.paramKey){
          paramsKeyList.push(item?.config?.paramKey)
          paramsList.push({
            paramName: item.config?.paramKey,
            paramType: item.config?.paramType,
            paramDesc: item?.config?.paramDesc
          })
        }
      })
    }
    if ([...(new Set(paramsKeyList))].length < paramsKeyList.length || paramsKeyList.length < widgetFormList.length){
      message.warn('请检查各题目参数名是否按要求定义', 2)
      return
    }
    const data = {
      config: {
        tmpName: globalConfig.pageName,
        tmpDesc: globalConfig.pageDesc,
        tmpJson: JSON.stringify(state),
        repeatAble: 1,
        tmpType: 0,
      },
      params: paramsList
    }
    saveTemplate(data).then((res) => {
      console.log(res)
    })
  }

  return (
    <>
      <Layout.Header className="btn-bar">
        <Space>{state.globalConfig?.pageName}</Space>
        <Space>
          表单设计
        </Space>
        <Space>
          {preview && (
            <div className="btn" onClick={handlerSetVisible(setPreviewVisible, true)}>
              <img src={require('../image/preview-icon.png')} alt='' />
              <span>预览</span>
            </div>
          )}
          <div className="btn save" onClick={handleSave}>
            <img src={require('../image/save-icon.png')} alt='' />
            <span>保存</span>
          </div>
          <div className="btn" onClick={handleClear}>
            <img src={require('../image/publish-icon.png')} alt='' />
            <span>发布</span>
          </div>
        </Space>
      </Layout.Header>
      <PreviewModal
        title="预览"
        footer={null}
        visible={previewVisible}
        json={state}
        onCancel={handlerSetVisible(setPreviewVisible, false)}
      />
      <GenerateJsonModal title="生成Json" width="50%" visible={generateJsonVisible} onCancel={handlerSetVisible(setGenerateJsonVisible, false)} />
    </>
  )
}
export default Header
