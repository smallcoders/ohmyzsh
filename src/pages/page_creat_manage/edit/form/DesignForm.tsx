import { useContext, useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { Layout, Form, message } from 'antd';
import GlobalHeaderRight from '@/components/RightContent'
import { history, Prompt } from 'umi';
import {getTemplatePageInfo} from '@/services/page-creat-manage'
import logoImg from '@/assets/page_creat_manage/logo-img.png'
import { listAllAreaCode } from '@/services/common';
import ComponentsGroup from './ComponentsGroup'
import Header from './Header'
import WidgetForm from './WidgetForm'
import WidgetConfig from './WidgetConfig'
import GlobalConfig from './GlobalConfig'
import { DesignContext, DesignProvider } from '../store'
import { ActionType } from '../store/action'
import { componentsGroupList } from '../config'
import generateCode from '../utils/generateCode'

const { Content, Sider } = Layout

export interface DesignFormProps {
  uploadJson?: boolean
  clearable?: boolean
  preview?: boolean
  generateJson?: boolean
  generateCode?: boolean
}

export interface DesignFormRef {
  getJson: () => string
  setJson: (value: string) => void
  clear: () => void
  getTemplate: (type: 'component' | 'html') => string
}

const DesignForm = forwardRef<DesignFormRef, DesignFormProps>((props, ref) => {
  const { state, dispatch } = useContext(DesignContext)
  const [formInstance] = Form.useForm()
  const id = history.location.query?.id as string;
  const [currentTab, setCurrentTab] = useState<'Global' | 'Local'>('Global')
  const [areaCodeOptions, setAreaCodeOptions] = useState<any>({countyOptions: [], cityOptions: []})
  const [initJson, setInitJson] = useState<string>('')
  const [publishSuccess, setPublishSuccess] = useState<boolean>(false)
  const listener = (e: any) => {
    e.preventDefault();
    e.returnValue = '';
  };
  useEffect(() => {
    listAllAreaCode().then((res) => {
      if (res?.result){
        const {result} = res

        const cityOptions: any = []
        result.forEach((item: any) => {
          cityOptions.push({
            ...item,
            nodes: item.nodes?.map((node: any) => {
              const {nodes, ...reset} = node
              return reset
            })
          })
        })
        setAreaCodeOptions({
          countyOptions: result,
          cityOptions
        })
      }
    })
    window.addEventListener('beforeunload', listener);
    return () => {
      window.removeEventListener('beforeunload', listener);
    };
  }, []);
  useEffect(() => {
    // @ts-ignore
    setCurrentTab(state?.selectWidgetItem?.type ? 'Local' : 'Global')
  },[state?.selectWidgetItem])

  useEffect(() => {
    if (id){
      getTemplatePageInfo({
        id
      }).then((res) => {
        if (res?.code === 0 && res?.result?.tmpJson){
          dispatch({
            type: ActionType.SET_GLOBAL,
            payload: {...JSON.parse(res?.result?.tmpJson), id}
          })
          setInitJson(res?.result?.tmpJson || '')
        } else {
          message.error(res?.message)
        }
      })
    }
  }, [])
  useImperativeHandle(ref, () => ({
    getJson: () => JSON.stringify(state),
    setJson: (value) => {
      try {
        dispatch({
          type: ActionType.SET_GLOBAL,
          payload: JSON.parse(value)
        })
      } catch (error) {
        message.error('设置 JSON 出错')
      }
    },
    clear: () => {
      dispatch({
        type: ActionType.SET_GLOBAL,
        payload: {
          widgetFormList: [],
          selectWidgetItem: undefined
        }
      })
    },
    getTemplate: (type) => generateCode(type, state)
  }))

  const callback = (json: string, type: string) => {
    setInitJson(json)
    if (type === 'publish'){
      setPublishSuccess(true)
    }
  }
  // 获取页面是否修改
  const isChanged = () => {
    const initState = JSON.parse(initJson || '{}')
    const { id: oldId, selectWidgetItem,...resetInitState} = initState
    const {id: newId, selectWidgetItem: newSelect,...resetNewState} = state
    return !publishSuccess && state?.widgetFormList?.length > 0 && JSON.stringify(resetInitState) !== JSON.stringify(resetNewState)
  }
  return (
    <div  className="fc-style">
      <Prompt
        when={isChanged()}
        message={'表单设计有修改，是否直接离开'}
      />
      <div className="top-header">
        <img src={logoImg} alt='' />
        <div className="top-header-right">
          羚羊运营平台
        </div>
        <GlobalHeaderRight />
      </div>
      <div>
        <Header {...props} callback={callback} areaCodeOptions={areaCodeOptions} />
        <Layout className="fc-container">
          <Sider theme="light" width={250} style={{ overflow: 'auto' }}>
            <div className="components">
              {componentsGroupList.map((componentGroup) => (
                <ComponentsGroup key="基础字段" componentGroup={componentGroup} />
              ))}
            </div>
          </Sider>
          <Layout className="center-container">
            <Content className="widget-empty">
              <Layout>
                <WidgetForm areaCodeOptions={areaCodeOptions} formInstance={formInstance} />
              </Layout>
            </Content>
          </Layout>
          <Sider className="widget-config-container" theme="light" width={300}>
            <Layout>
              <>
                <Layout.Header>
                  <div className={`config-tab ${currentTab === 'Local' && 'active'}`} onClick={() => setCurrentTab('Local')}>
                    字段属性
                  </div>
                  <div className={`config-tab ${currentTab === 'Global' && 'active'}`} onClick={() => setCurrentTab('Global')}>
                    表单属性
                  </div>
                </Layout.Header>
                <Content className="config-content">{currentTab === 'Local' ? <WidgetConfig /> : <GlobalConfig />}</Content>
              </>
            </Layout>
          </Sider>
        </Layout>
      </div>
    </div>
  )
})

DesignForm.defaultProps = {
  uploadJson: true,
  clearable: true,
  preview: true,
  generateJson: true,
  generateCode: true
}

export default forwardRef<DesignFormRef, DesignFormProps>((props, ref) => (
  <DesignProvider>
    <DesignForm {...props} ref={ref} />
  </DesignProvider>
))
