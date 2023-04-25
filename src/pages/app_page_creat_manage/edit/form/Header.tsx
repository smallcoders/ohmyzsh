import { useState, useContext } from 'react';
import { Button, Layout, message as antdMessage, message, Popover, Space } from 'antd';
import { useHistory } from 'react-router-dom';
import { saveTemplate, addOperationLog, saveAppTemplate } from '@/services/page-creat-manage';
import preViewIcon from '@/assets/page_creat_manage/preview-icon.png'
import saveIcon from '@/assets/page_creat_manage/save-icon.png'
import publishIcon from '@/assets/page_creat_manage/publish-icon.png'
import PreviewModal from '../components/PreviewModal'
import { useConfig } from '../hooks/hooks'
import { ActionType } from '../store/action'
import { DesignContext } from '../store'
import { routeName } from '../../../../../config/routes';

const Header = (props: any) => {
  const { callback, areaCodeOptions } = props
  const { state } = useContext(DesignContext)
  const { dispatch } = useConfig()
  const [previewVisible, setPreviewVisible] = useState(false)
  const [newWinUrl, setNewWinUrl] = useState<any>(null)
  const history: any = useHistory();
  const tmpType = history.location.query?.type
  const checkParams = () => {
    const { widgetFormList, globalConfig, id, webGlobalConfig } = state;
    const paramsList: any = []
    const paramsKeyList: string[] = []

    if (!webGlobalConfig.activeTime) {
      message.warn('请先设置活动时间')
      return;
    }

    if (!widgetFormList.length) {
      message.warn('请先设置题目', 2)
      return;
    }
    if (tmpType !== '1') {
      if (widgetFormList.length) {
        widgetFormList.forEach((item) => {
          if (item?.config?.paramKey) {
            paramsKeyList.push(item?.config?.paramKey)
            paramsList.push({
              paramName: item.config?.paramKey,
              paramType: item.config?.paramType,
              paramDesc: item?.config?.paramDesc
            })
          }
        })
      }
      if (globalConfig.showRegister) {
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
    }
    const data = {
      config: {
        startTime: webGlobalConfig.activeTime[0],
        endTime: webGlobalConfig.activeTime[1],
        tmpName: tmpType === '1' ? webGlobalConfig.pageName : globalConfig.pageName,
        tmpDesc: tmpType === '1' ? webGlobalConfig.pageDesc : globalConfig.pageDesc,
        tmpJson: JSON.stringify(state),
        repeatAble: 1,
        tmpType: 2,
        state: 0,
      },
      params: paramsList
    }
    if (id) {
      data.config['tmpId'] = id
    }
    return data
  }

  const requiredJudge = (lastConfig: any) => {

    if (!lastConfig?.product?.value) {
      message.error('请选择应用商品')
      return false
    }
    if (!lastConfig?.icon) {
      message.error('请上传图标')
      return false
    }
    if (!lastConfig?.desc) {
      message.error('请输入商品简介')
      return false
    }
    if (!lastConfig?.specId) {
      message.error('请选择商品规格')
      return false
    }
    if (!lastConfig?.time) {
      message.error('请选择使用期限')
      return false
    }
    if ((!lastConfig?.num) && (!lastConfig?.isLimit)) {
      message.error('请输入活动数量或者勾选无限制')
      return false
    }

    return true
  }

  const handleSave = () => {
    const data: any = checkParams()
    if (!data) {
      return
    }

    const appConfig = state?.widgetFormList?.find(p => p?.type === 'App')?.config

    if (appConfig?.productList && appConfig?.productList?.length > 0) {
      if (!requiredJudge(appConfig?.productList[appConfig?.productList?.length - 1])) {
        return
      }
      data.list = appConfig?.productList?.map((p: any) => {
        return {
          productId: p?.product?.value,
          appId: p?.product?.appId,
          type: p?.product?.type,
          specId: p?.specId,
          expireDay: p?.time,
          actNum: p?.isLimit ? -1 : p?.num
        }
      })
    }

    saveAppTemplate(data).then((res) => {
      if (res.code === 0) {
        message.success('保存成功')
        if (callback) {
          callback(data.config.tmpJson, 'save')
        }
        if (res.result) {
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
    const { id } = state;
    const data: any = checkParams()
    if (!data) {
      return
    }
    data.config.state = 1;
    addOperationLog({
      tmpId: id,
      type: 2,
    })

    const appConfig = state?.widgetFormList?.find(p => p?.type === 'App')?.config

    if (appConfig?.productList && appConfig?.productList?.length > 0) {
      if (!requiredJudge(appConfig?.productList[appConfig?.productList?.length - 1])) {
        return
      }
      data.list = appConfig?.productList?.map((p: any) => {
        return {
          productId: p?.product?.value,
          appId: p?.product?.appId,
          type: p?.product?.type,
          specId: p?.specId,
          expireDay: p?.time,
          actNum: p?.isLimit ? -1 : p?.num
        }
      })
    }


    saveAppTemplate(data).then((res) => {
      if (res.code === 0) {
        if (callback) {
          callback(data.config.tmpJson, 'publish')
        }
        antdMessage.success(`发布成功`);
        history.replace(`${routeName.APP_PAGE_CREAT_MANAGE_PUBLISH}?id=${id || res.result}&type=1`);
      } else {
        antdMessage.error(`${res.message}`);
      }
    })

  }

  return (
    <>
      <Layout.Header className="btn-bar">
        <Space>{tmpType === '1' ? state.webGlobalConfig.pageName : state.globalConfig?.pageName}</Space>
        <div className="middle-title">
          {tmpType === '1' ? '活动模版设计' : '表单设计'}
        </div>
        <Space>
          <Popover content={
            <div style={{ display: 'grid', gap: 10 }}>
              <Button onClick={() => {

                console.log('state', state)

                localStorage.setItem('webTmpInfo', JSON.stringify({
                  tmpJson: JSON.stringify(state),
                  tmpType: 1,
                  state: 0,
                }))
                if (!newWinUrl || newWinUrl && newWinUrl?.closed) {
                  const winUrl = window.open(`${routeName.APP_PAGE_CREAT_MANAGE_WEB_PREVIEW}?type=${tmpType || ''}`);
                  setNewWinUrl(winUrl)
                }
                if (newWinUrl && !newWinUrl.closed) {
                  newWinUrl.location.reload()
                }

              }}
                type="primary"
              >pc</Button>
              <Button type="primary"
                onClick={() => {
                  if (tmpType === '1') {
                    localStorage.setItem('appTmpInfo', JSON.stringify({
                      tmpJson: JSON.stringify(state),
                      tmpType: 1,
                      state: 0,
                    }))
                    if (!newWinUrl || newWinUrl && newWinUrl?.closed) {
                      const winUrl = window.open(`${routeName.APP_PAGE_CREAT_MANAGE_APP_PREVIEW}?type=${tmpType || ''}`);
                      setNewWinUrl(winUrl)
                    }
                    if (newWinUrl && !newWinUrl.closed) {
                      newWinUrl.location.reload()
                    }
                  } else {
                    setPreviewVisible(true)
                  }
                }}
              >
                app
              </Button>
            </div>
          }>
            <div className="btn">
              <img src={preViewIcon} alt='' />
              <span>预览</span>
            </div>
          </Popover>
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
        onCancel={() => {
          setPreviewVisible(false)
        }}
      />
    </>
  )
}
export default Header
