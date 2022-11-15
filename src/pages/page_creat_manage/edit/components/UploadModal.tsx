import React, { useRef } from 'react'
import { Modal, message } from 'antd'
import MonacoEditor from './MonacoEditor'
import { useConfig } from '../hooks/hooks'
import { ActionType } from '../store/action'

const UploadModal= (props: any) => {
  const { close } = props
  const monacoValue = useRef('')
  const { dispatch } = useConfig()

  const handleChange = (value: string) => {
    monacoValue.current = value
  }

  const handleUpload = () => {
    try {
      dispatch({
        type: ActionType.SET_GLOBAL,
        payload: JSON.parse(monacoValue.current)
      })
      message.success('导入成功')
      close()
    } catch (error) {
      message.error('导入失败')
    }
  }

  return (
    <Modal {...props} destroyOnClose onOk={handleUpload}>
      <MonacoEditor language="json" height={document.body.clientHeight / 1.5} value="" onChange={handleChange} />
    </Modal>
  )
}

export default UploadModal
