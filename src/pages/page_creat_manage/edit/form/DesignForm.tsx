import React, { useContext, useMemo, useState, forwardRef, useImperativeHandle } from 'react'
import { Layout, Form, message } from 'antd';
import GlobalHeaderRight from '@/components/RightContent'
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

  const [currentTab, setCurrentTab] = useState<'Global' | 'Local'>('Global')

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

  return (
    <div  className="fc-style">
      <div className="top-header">
        <div className="top-header-right">
          羚羊工业平台
        </div>
        <GlobalHeaderRight />
      </div>
      <div>
        <Header {...props} />
        <Layout className="fc-container">
          <Sider theme="light" width={250} style={{ overflow: 'auto' }}>
            {useMemo(
              () => (
                <div className="components">
                  {componentsGroupList.map((componentGroup) => (
                    <ComponentsGroup key="组件" componentGroup={componentGroup} />
                  ))}
                </div>
              ),
              []
            )}
          </Sider>
          <Layout className="center-container">
            <Content className="widget-empty">
              <Layout>
                <WidgetForm formInstance={formInstance} />
              </Layout>
            </Content>
          </Layout>
          <Sider className="widget-config-container" theme="light" width={300}>
            <Layout>
              {useMemo(
                () => (
                  <>
                    <Layout.Header>
                      <div className={`config-tab ${currentTab === 'Local' && 'active'}`} onClick={() => setCurrentTab('Local')}>
                        字段设置
                      </div>
                      <div className={`config-tab ${currentTab === 'Global' && 'active'}`} onClick={() => setCurrentTab('Global')}>
                        基本设置
                      </div>
                    </Layout.Header>
                    <Content className="config-content">{currentTab === 'Local' ? <WidgetConfig /> : <GlobalConfig />}</Content>
                  </>
                ),
                [currentTab]
              )}
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
