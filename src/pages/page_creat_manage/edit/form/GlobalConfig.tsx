import { FC, useContext, useMemo } from 'react'
import { Form, Input, Checkbox } from 'antd';
import UploadForm from '@/components/upload_form';
import { DesignContext } from '../store'
import { ActionType } from '../store/action'

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
            <Form.Item label="表单名称" required >
              <Input
                maxLength={20}
                value={globalConfig?.pageName}
                onChange={(event) => handleGlobalConfigChange('pageName',event.target.value)}
                onBlur={(event) => {
                  if(!event.target.value){
                    handleGlobalConfigChange('pageName', '未命名表单')
                  }
                }}
              />
              <Checkbox checked={globalConfig?.showPageName} onChange={(e) => handleGlobalConfigChange('showPageName',e.target.checked)}>显示表单名称</Checkbox>
            </Form.Item>
            <Form.Item label="描述信息" >
              <Input value={globalConfig?.pageDesc} onChange={(event) => handleGlobalConfigChange('pageDesc',event.target.value)} />
              <Checkbox checked={globalConfig?.showDesc} onChange={(e) => handleGlobalConfigChange('showDesc',e.target.checked)}>显示表单名称</Checkbox>
            </Form.Item>
            <Form.Item label="表单背景" >
              <UploadForm
                listType="picture-card"
                className="avatar-uploader"
                maxSize={1}
                action={'/antelope-common/common/file/upload/record'}
                showUploadList={false}
                accept=".bmp,.gif,.png,.jpeg,.jpg"
                value={globalConfig?.pageBg}
                onChange={(value: any) => {
                  handleGlobalConfigChange('pageBg', value?.path || value)
                }}
              />
            </Form.Item>
            <Form.Item label="提交按钮" >
              <Input
                maxLength={6}
                value={globalConfig?.btnText}
                onChange={(event) => handleGlobalConfigChange('btnText',event.target.value)}
                onBlur={(event) => {
                  if(!event.target.value){
                    handleGlobalConfigChange('btnText', '提交')
                  }
                }}
              />
            </Form.Item>
          </Form>
        ),
        [globalConfig, formConfig]
      )}
    </>
  )
}

export default GlobalConfig
