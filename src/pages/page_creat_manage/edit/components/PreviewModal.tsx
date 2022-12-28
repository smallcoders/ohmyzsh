import { useState } from 'react'
import { Form, Modal, Radio } from 'antd';
import GenerateForm from '../form/GenerateForm'
import '../style/previewModal.less'
import { previewTypeOption } from '../utils/options';

const height = window.screen.availHeight

const PreviewModal = (props: any) => {
  const [previewType, setPreviewType] = useState('web端预览')
  return (
    <>
      <Modal
        width={814}
        destroyOnClose
        centered
        bodyStyle={{
          height: `${height - 285}px`,
        }}
        {...props}
      >
        <Form.Item>
          <Radio.Group
            optionType="button"
            buttonStyle="solid"
            value={previewType}
            options={previewTypeOption}
            onChange={(event) => setPreviewType(event.target.value)}
          />
        </Form.Item>
        <GenerateForm areaCodeOptions={props.areaCodeOptions} isMobile={previewType !== 'web端预览'} widgetInfoJson={JSON.stringify(props.json)} />
      </Modal>
    </>
  )
}

export default PreviewModal
