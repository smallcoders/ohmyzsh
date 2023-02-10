import { useState, useContext } from 'react';
import { Layout, message as antdMessage, message, Space } from 'antd';
import { useHistory } from 'react-router-dom';
import { cloneDeep } from 'lodash-es';
import { saveTemplate, addOperationLog } from '@/services/page-creat-manage';
import preViewIcon from '@/assets/page_creat_manage/preview-icon.png'
import saveIcon from '@/assets/page_creat_manage/save-icon.png'
import publishIcon from '@/assets/page_creat_manage/publish-icon.png'
import PreviewModal from '../components/PreviewModal'
import { useConfig } from '../hooks/hooks'
import { ActionType } from '../store/action'
import { DesignContext } from '../store'
import { routeName } from '../../../../../config/routes';

const Header = (props: any) => {
  const { preview, callback, areaCodeOptions } = props
  const { state } = useContext(DesignContext)
  const { handlerSetVisible, dispatch } = useConfig()
  const [previewVisible, setPreviewVisible] = useState(false)
  const history = useHistory();
  const checkParams = () => {
    const { widgetFormList, globalConfig, id } =  state;
    const newState = cloneDeep(state)
    const paramsList: any = []
    const paramsKeyList: string[] = []
    if (!widgetFormList.length){
      message.warn('请先设置题目', 2)
      return;
    }
    let hasError = false
    if (widgetFormList.length){
      widgetFormList.forEach((item, index) => {
        if (item?.config?.paramKey){
          paramsKeyList.push(item?.config?.paramKey)
          paramsList.push({
            paramName: item.config?.paramKey,
            paramType: item.config?.paramType,
            paramDesc: item?.config?.paramDesc
          })
        }
        if (!(item?.config?.paramKey)){
          hasError = true
          if (newState.selectWidgetItem?.key === item.key){
            newState.selectWidgetItem!.errorMsg = '参数名不得为空'
          }
          newState.widgetFormList[index].errorMsg = '参数名不得为空'
        } else if (/[^\w]/g.test(item?.config?.paramKey)){
          hasError = true
          if (newState.selectWidgetItem?.key === item.key){
            newState.selectWidgetItem!.errorMsg = '只允许输入大小写字母、下划线及数字'
          }
          newState.widgetFormList[index]!.errorMsg = '只允许输入大小写字母、下划线及数字'
        }
      })
    }
    if (hasError || [...(new Set(paramsKeyList))].length < paramsKeyList.length || paramsKeyList.length < widgetFormList.length){
      dispatch({
        type: ActionType.SET_GLOBAL,
        payload: newState
      })
      message.warn('请检查各题目参数名是否按要求定义', 2)
      return
    }
    if (globalConfig.showRegister){
      paramsList.push({
        paramName: 'registerName',
        paramType: 'string',
        paramDesc: '注册姓名'
      })
      paramsList.push({
        paramName: 'registerPhone',
        paramType: 'string',
        paramDesc: '注册手机号码'
      })
    }
    const data = {
      config: {
        tmpName: globalConfig.pageName,
        tmpDesc: globalConfig.pageDesc,
        tmpJson: JSON.stringify(state),
        repeatAble: 1,
        tmpType: 0,
        state: 0,
      },
      params: paramsList
    }
    if (id){
      data.config['tmpId'] = id
    }
    return data
  }


  const handleSave = () => {
    const data: any = checkParams()
    if (!data){
      return
    }
    saveTemplate(data).then((res) => {
      if (res.code === 0){
        message.success('保存成功')
        if (callback){
          callback(data.config.tmpJson, 'save')
        }
        if (res.result){
          dispatch({
            type: ActionType.SET_GLOBAL,
            payload: {
              id: res.result,
            }
          })
        }
      } else {
        message.error(res?.message)
      }
    })
  }

  const handlePublish = () => {
    const { id } =  state;
    const data: any = checkParams()
    if (!data){
      return
    }
    data.config.state = 1;
    addOperationLog({
      tmpId: id,
      type: 2,
    })
    saveTemplate(data).then((res) => {
      if (res.code === 0){
        if (callback){
          callback(data.config.tmpJson, 'publish')
        }
        antdMessage.success(`发布成功`);
        history.replace(`${routeName.PAGE_CREAT_MANAGE_PUBLISH}?id=${id || res.result}`);
      } else {
        antdMessage.error(`${res.message}`);
      }
    })

  }

  return (
    <>
      <Layout.Header className="btn-bar">
        <Space>{state.globalConfig?.pageName}</Space>
        <div className="middle-title">
          表单设计
        </div>
        <Space>
          {preview && (
            <div className="btn" onClick={handlerSetVisible(setPreviewVisible, true)}>
              <img src={preViewIcon} alt='' />
              <span>预览</span>
            </div>
          )}
          <div className="btn save" onClick={handleSave}>
            <img src={saveIcon} alt='' />
            <span>保存</span>
          </div>
          <div className="btn" onClick={handlePublish}>
            <img src={publishIcon} alt='' />
            <span>发布</span>
          </div>
        </Space>
      </Layout.Header>
      <PreviewModal
        title="预览"
        footer={null}
        visible={previewVisible}
        json={state}
        areaCodeOptions={areaCodeOptions}
        onCancel={handlerSetVisible(setPreviewVisible, false)}
      />
    </>
  )
}
export default Header
