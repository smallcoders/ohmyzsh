import { useContext, useState, useEffect } from 'react';
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
import WebGlobalConfig from './WebGlobalConfig';
import { DesignContext, DesignProvider } from '../store'
import { ActionType } from '../store/action'
import { formComponentsList, webComponentsList } from '../config'

const { Content, Sider } = Layout
const DesignForm = () => {
  const { state, dispatch } = useContext(DesignContext)
  const [formInstance] = Form.useForm()
  const id = history.location.query?.id as string;
  const tmpType = history.location.query?.type as string
  const [currentTab, setCurrentTab] = useState<'Global' | 'Local'>('Global')
  const [areaCodeOptions, setAreaCodeOptions] = useState<any>({county: [], city: [], province: []})
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
        const city: any = []
        const province: any = []
        result.forEach((item: any) => {
          city.push({
            ...item,
            nodes: item.nodes?.map((node: any) => {
              const {nodes, ...reset} = node
              return reset
            })
          })
          const {nodes, ...reset} = item
          province.push(reset)
        })
        setAreaCodeOptions({
          county: result,
          city,
          province
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
        message={`${tmpType === '1' ? '网页' : '表单'}设计有修改，是否直接离开`}
      />
      <div style={{height: '48px', width: '100%'}} className="occupancy" />
      <div className="top-header">
        <div className="top-header-right" onClick={() => {
          history.push('/');
        }}>
          <img src={logoImg} alt='' />
          <span>羚羊运营平台</span>
        </div>
        <GlobalHeaderRight />
      </div>
      <Header callback={callback} areaCodeOptions={areaCodeOptions} />
      <div style={{height: '48px', width: '100%'}} className="occupancy" />
      <Layout className="fc-container">
        <Sider theme="light" className="components-container" width={250} style={{ overflow: 'auto' }}>
          <div className="components">
            {(tmpType === '1' ? webComponentsList : formComponentsList).map((componentGroup) => (
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
        <Sider className="widget-config-container" theme="light" width={320}>
          <Layout>
            <>
              <Layout.Header>
                <div className={`config-tab ${currentTab === 'Local' && 'active'}`} onClick={() => setCurrentTab('Local')}>
                  字段属性
                </div>
                <div className={`config-tab ${currentTab === 'Global' && 'active'}`} onClick={() => setCurrentTab('Global')}>
                  {tmpType === '1' ? '网页属性' : '表单属性' }
                </div>
              </Layout.Header>
              <Content className="config-content">
                {currentTab === 'Local' ? <WidgetConfig /> : tmpType === '1' ? <WebGlobalConfig /> : <GlobalConfig />}
              </Content>
            </>
          </Layout>
        </Sider>
      </Layout>
    </div>
  )
}

export default () => (
  <DesignProvider>
    <DesignForm />
  </DesignProvider>
)
