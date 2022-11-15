import React, { useMemo, useState, MouseEvent, FC, useContext } from 'react';
import { Layout, Space } from 'antd'
import PreviewModal from '../components/PreviewModal'
import GenerateJsonModal from '../components/GenerateJsonModal'
import { useConfig } from '../hooks/hooks'
import { ActionType } from '../store/action'
import type { DesignFormProps } from './index'
import { DesignContext } from '../store'
const Header: FC<DesignFormProps> = (props) => {
  const { uploadJson, clearable, preview, generateJson, generateCode } = props
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
  return (
    <>
      {useMemo(
        () => (
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
              <div className="btn save">
                <img src={require('../image/save-icon.png')} alt='' />
                <span>保存</span>
              </div>
              <div className="btn" onClick={handleClear}>
                <img src={require('../image/publish-icon.png')} alt='' />
                <span>发布</span>
              </div>
              {generateJson && (
                <div onClick={handlerSetVisible(setGenerateJsonVisible, true)}>
                  生成JSON
                </div>
              )}
            </Space>
          </Layout.Header>
        ),
        [uploadJson, clearable, preview, generateJson, generateCode]
      )}
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
        json={state}
        onCancel={handlerSetVisible(setPreviewVisible, false)}
      />
      <GenerateJsonModal title="生成Json" width="50%" visible={generateJsonVisible} onCancel={handlerSetVisible(setGenerateJsonVisible, false)} />
    </>
  )
}
export default Header
