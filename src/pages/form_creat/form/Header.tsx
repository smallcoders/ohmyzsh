import React, { useMemo, useState, MouseEvent, FC } from 'react'
import { Layout, Space } from 'antd'
import UploadModal from '../components/UploadModal'
import PreviewModal from '../components/PreviewModal'
import GenerateJsonModal from '../components/GenerateJsonModal'
import { useConfig } from '../hooks'
import { ActionType } from '../store/action'

import type { DesignFormProps } from './index'

const Header: FC<DesignFormProps> = (props) => {
  const { uploadJson, clearable, preview, generateJson, generateCode } = props
  const { handlerSetVisible, dispatch } = useConfig()
  const [uploadVisible, setUploadVisible] = useState(false)
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
            <Space>
              {uploadJson && (
                <a href="/#" onClick={handlerSetVisible(setUploadVisible, true)}>
                  导入Json
                </a>
              )}
              {clearable && (
                <a href="/#" onClick={handleClear}>
                  清空
                </a>
              )}
              {preview && (
                <a href="/#" onClick={handlerSetVisible(setPreviewVisible, true)}>
                  预览
                </a>
              )}
              {generateJson && (
                <a href="/#" onClick={handlerSetVisible(setGenerateJsonVisible, true)}>
                  生成JSON
                </a>
              )}
            </Space>
          </Layout.Header>
        ),
        [uploadJson, clearable, preview, generateJson, generateCode]
      )}
      <UploadModal title="导入Json" width="50%" visible={uploadVisible} close={handlerSetVisible(setUploadVisible, false)} onCancel={handlerSetVisible(setUploadVisible, false)} />
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
          minHeight: 'calc(100vh - 108px)'
        }}
        visible={previewVisible}
        onCancel={handlerSetVisible(setPreviewVisible, false)}
      />
      <GenerateJsonModal title="生成Json" width="50%" visible={generateJsonVisible} onCancel={handlerSetVisible(setGenerateJsonVisible, false)} />
    </>
  )
}

export default Header
