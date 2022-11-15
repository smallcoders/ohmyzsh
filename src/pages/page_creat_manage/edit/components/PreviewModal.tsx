import React, { useRef, useState } from 'react'
import { Form, Modal, Radio } from 'antd';
import GenerateForm, { GenerateFormRef } from '../form/GenerateForm'
import '../style/previewModal.less'
import { previewTypeOption } from '../utils/options';

const PreviewModal = (props: any) => {
  const ref = useRef<GenerateFormRef>(null)
  const [previewType, setPreviewType] = useState('web端预览')
  return (
    <>
      <Modal {...props} destroyOnClose>
        <Form.Item>
          <Radio.Group
            optionType="button"
            buttonStyle="solid"
            value={previewType}
            options={previewTypeOption}
            onChange={(event) => setPreviewType(event.target.value)}
          />
        </Form.Item>
        <GenerateForm isMobile={previewType !== 'web端预览'} widgetInfoJson={JSON.stringify(props.json)} ref={ref} />
      </Modal>
    </>
  )
}

export default PreviewModal
