import { FC, useContext, useMemo } from 'react'
import { Button, Form, Input, message, Select, Tooltip } from 'antd';
import { DesignContext } from '../store'
import { ActionType } from '../store/action'
import dragIcon from '@/assets/page_creat_manage/drag-item.png';
import UploadForm from '@/pages/page_creat_manage/edit/components/upload_form/upload-form';
import { clone } from 'lodash-es';

const GlobalConfig: FC = () => {
  const {
    state: { globalConfig, formConfig },
    dispatch
  } = useContext(DesignContext)

  const handleGlobalConfigChange = <T extends keyof typeof globalConfig>(fieldName: T, value: typeof globalConfig[T]) => {
    const action = {
      type: ActionType.SET_GLOBAL_CONFIG,
      payload: {
        ...globalConfig,
        [fieldName]: value
      }
    }
    dispatch(action)
  }


  return (
    <>
      {useMemo(
        () => (
          <Form layout="vertical">
            <Form.Item label="提示文案" required >
              <Input
                maxLength={8}
                value={globalConfig?.successTitle}
                onChange={(event) => handleGlobalConfigChange('successTitle',event.target.value)}
                onBlur={(event) => {
                  if(!event.target.value){
                    handleGlobalConfigChange('successTitle', '提交成功')
                  }
                }}
              />
            </Form.Item>
            <Form.Item label="描述信息" required >
              <Input.TextArea
                rows={3}
                maxLength={50}
                value={globalConfig?.successSubTitle}
                onChange={(event) => handleGlobalConfigChange('successSubTitle',event.target.value)}
                onBlur={(event) => {
                  if(!event.target.value){
                    handleGlobalConfigChange('successSubTitle', '提交成功')
                  }
                }}
              />
            </Form.Item>
            <Form.Item label="定制化配置" >
              <Select
                value={globalConfig?.successConfigType}
                allowClear
                onChange={(value) => {
                  handleGlobalConfigChange('successConfigType', value)
                }}
                options={[
                  {
                    label: '图片配置',
                    value: 'img'
                  },
                  {
                    label: '链接配置',
                    value: 'link'
                  }
                ]}
              />
            </Form.Item>
            {
              globalConfig?.successConfigType === 'link' &&
              <Form.Item label="web端链接" >
                <Input placeholder="https://" />
              </Form.Item>
            }
            {
              globalConfig?.successConfigType === 'link' &&
              <Form.Item label="移动端链接" >
                <Input placeholder="https://" />
              </Form.Item>
            }
            {
              globalConfig?.successConfigType === 'img' &&
              <div className="option-item">
                <UploadForm
                  listType="picture-card"
                  className="avatar-uploader"
                  maxSize={10}
                  action={'/antelope-common/common/file/upload/record'}
                  showUploadList={false}
                  value={globalConfig?.pcImg}
                  style={{width: '36px', height: '36px', marginBottom: 0}}
                  accept=".bmp,.gif,.png,.jpeg,.jpg"
                  noUploadText={true}
                />
                <div>
                  <Tooltip
                    title={globalConfig.pcLink}
                  >
                    <Input
                      value={globalConfig.pcLink}
                      maxLength={50}
                      className="ellipsis"
                      placeholder="https://"
                      onChange={(event) => {
                      }}
                    />
                  </Tooltip>
                </div>
              </div>
            }
            {
              globalConfig?.successConfigType === 'img' &&
              <Form.Item label="移动端链接" >
                <Input placeholder="https://" />
              </Form.Item>
            }
          </Form>
        ),
        [globalConfig, formConfig]
      )}
    </>
  )
}

export default GlobalConfig
