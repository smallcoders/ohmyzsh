import { FC, useContext, useMemo } from 'react'
import { Form, Input, InputNumber, Select, Tooltip } from 'antd';
import { DesignContext } from '../store'
import { ActionType } from '../store/action'
import UploadForm from '@/pages/page_creat_manage/edit/components/upload_form/upload-form';
import questionIcon from '@/assets/page_creat_manage/question_icon.png';

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

  const handleGlobalConfigListChange = (configs: any) => {
    const action = {
      type: ActionType.SET_GLOBAL_CONFIG,
      payload: {
        ...globalConfig,
        ...configs
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
                    handleGlobalConfigChange('successSubTitle', '工业互联网，价值在羚羊，快去羚羊平台逛逛吧！')
                  }
                }}
              />
            </Form.Item>
            <Form.Item label="定制化配置" >
              <Select
                value={globalConfig?.successConfigType}
                allowClear
                onChange={(value) => {
                  let params: any = {
                    successConfigType: value
                  }
                  if (!value){
                    params = {
                      pcImg: '',
                      mobileImg: '',
                      pcLink: '',
                      mobileLink: '',
                      pcImgHeight: 460,
                      pcImgWidth: 344,
                      mobileImgHeight: 460,
                      mobileImgWidth: 344,
                      successConfigType: value
                    }
                  }
                  handleGlobalConfigListChange(params)
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
                <Input
                  value={globalConfig?.pcLink}
                  placeholder="https://"
                  onChange={(e) => {
                    handleGlobalConfigChange('pcLink', e.target.value)
                  }}
                />
              </Form.Item>
            }
            {
              globalConfig?.successConfigType === 'link' &&
              <Form.Item label="移动端链接" >
                <Input
                  value={globalConfig?.mobileLink}
                  placeholder="https://"
                  onChange={(e) => {
                    handleGlobalConfigChange('mobileLink', e.target.value)
                  }}
                />
              </Form.Item>
            }
            {
              globalConfig?.successConfigType === 'img' &&
              <div>
                web端配置:
                <div className="config-item center size-config">
                  <div className="config-item-label">尺寸设置:</div>
                  <div className="flex special-style">
                    <InputNumber
                      value={globalConfig?.pcImgWidth}
                      max={344}
                      min={1}
                      onChange={(value) => {
                        handleGlobalConfigChange('pcImgWidth', value)
                      }}
                      controls
                      addonAfter={<span>W</span>}
                    />
                    <span className="multi-icon">*</span>
                    <InputNumber
                      value={globalConfig?.pcImgHeight}
                      max={460}
                      min={1}
                      controls
                      addonAfter={<span>H</span>}
                      onChange={(value) => {
                        handleGlobalConfigChange('pcImgHeight', value)
                      }}
                    />
                  </div>
                </div>
                <div>
                  图片上传
                  <Tooltip title="点击图片缩略图区域可上传图片,缩略图后方输入框可设置图片跳转链接">
                    <img className="question-icon" src={questionIcon} alt='' />
                  </Tooltip>
                </div>
                <div className="option-item success-config">
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
                    onChange={(value: any) => {
                      console.log(value, '99999')
                      handleGlobalConfigChange('pcImg', value?.path || value)
                    }}
                  />
                  <div>
                    <Tooltip
                      title={globalConfig.pcLink}
                    >
                      <Input
                        value={globalConfig.pcLink}
                        className="ellipsis"
                        placeholder="https://"
                        onChange={(e) => {
                          handleGlobalConfigChange('pcLink', e.target.value)
                        }}
                      />
                    </Tooltip>
                  </div>
                </div>
              </div>
            }
            {
              globalConfig?.successConfigType === 'img' &&
              <div style={{marginTop: '10px'}}>
                移动端配置:
                <div className="config-item center size-config">
                  <div className="config-item-label">尺寸设置:</div>
                  <div className="flex special-style">
                    <InputNumber
                      value={globalConfig?.mobileImgWidth}
                      max={344}
                      min={1}
                      onChange={(value) => {
                        handleGlobalConfigChange('mobileImgWidth', value)
                      }}
                      controls
                      addonAfter={<span>W</span>}
                    />
                    <span className="multi-icon">*</span>
                    <InputNumber
                      value={globalConfig?.mobileImgHeight}
                      max={460}
                      min={1}
                      controls
                      addonAfter={<span>H</span>}
                      onChange={(value) => {
                        handleGlobalConfigChange('mobileImgHeight', value)
                      }}
                    />
                  </div>
                </div>
                <div>
                  图片上传
                  <Tooltip title="点击图片缩略图区域可上传图片,缩略图后方输入框可设置图片跳转链接">
                    <img className="question-icon" src={questionIcon} alt='' />
                  </Tooltip>
                </div>
                <div className="option-item success-config">
                  <UploadForm
                    listType="picture-card"
                    className="avatar-uploader"
                    maxSize={10}
                    action={'/antelope-common/common/file/upload/record'}
                    showUploadList={false}
                    value={globalConfig?.mobileImg}
                    style={{width: '36px', height: '36px', marginBottom: 0}}
                    accept=".bmp,.gif,.png,.jpeg,.jpg"
                    noUploadText={true}
                    onChange={(value: any) => {
                      handleGlobalConfigChange('mobileImg', value?.path || value)
                    }}
                  />
                  <div>
                    <Tooltip
                      title={globalConfig.mobileLink}
                    >
                      <Input
                        value={globalConfig.mobileLink}
                        className="ellipsis"
                        placeholder="https://"
                        onChange={(e) => {
                          handleGlobalConfigChange('mobileLink', e.target.value)
                        }}
                      />
                    </Tooltip>
                  </div>
                </div>
              </div>
            }
          </Form>
        ),
        [globalConfig, formConfig]
      )}
    </>
  )
}

export default GlobalConfig
