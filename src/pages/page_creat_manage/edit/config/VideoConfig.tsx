import { Button, Form, InputNumber } from 'antd';
import UploadFormFile from '../components/upload_form/upload-form-file';
import { useConfig } from '../hooks/hooks'
import UploadForm from '../components/upload_form/upload-form';
import { UploadOutlined } from '@ant-design/icons';

const VideoConfig = () => {
  const { selectWidgetItem, handleChange } = useConfig()
  const { config } = selectWidgetItem || {}

  return (
    <>
      <Form.Item label="排版">
        <div className="config-item center">
          <div className="config-item-label">尺寸设置:</div>
          <div className="flex special-style">
            <InputNumber
              value={config?.videoAreaWidth}
              max={1200}
              min={1}
              onChange={(value) => handleChange(value, 'config.videoAreaWidth')}
              addonAfter={<span>W</span>}
            />
            <InputNumber
              value={config?.videoAreaHeight}
              max={9999}
              min={1}
              addonAfter={<span>H</span>}
              onChange={(value) => handleChange(value, 'config.videoAreaHeight')}
            />
          </div>
        </div>
        <div className="config-item">
          <div className="config-item-label">视频上传:</div>
          <div className="flex special-style">
            <UploadFormFile
              multiple={false}
              accept=".mp4"
              maxCount={1}
              showUploadList
              maxSize={50}
              onChange={(value: any) => {
                handleChange(value?.result?.path, 'config.url')
              }}
            >
              <Button icon={<UploadOutlined />}>上传视频</Button>
            </UploadFormFile>
          </div>
        </div>
        <div className="config-item center">
          <div className="config-item-label">封面上传:</div>
          <div className="flex special-style">
            <div>
              <UploadForm
                listType="picture-card"
                className="avatar-uploader"
                maxSize={10}
                noNeedUpload
                showUploadList={false}
                accept=".bmp,.gif,.png,.jpeg,.jpg"
                value={config?.coverImageUrl}
                onChange={(value: any) => {
                  handleChange(value?.path || value, 'config.coverImageUrl')
                }}
              />
            </div>
          </div>
        </div>
      </Form.Item>
    </>
  )
}

export default VideoConfig
