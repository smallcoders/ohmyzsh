import './index.less';
import scopedClasses from '@/utils/scopedClasses';
import { useEffect, useState } from 'react';
import FormEdit from '@/components/FormEdit'

import { Button, message, Spin, Empty, Tabs, Space, Form, Row, Col } from 'antd';

import { getInterfaceConfig, addInterfaceConfig, updateInterfaceConfig } from '@/services/digital-application';

type InterfaceType = '应用接口说明'|'API接口规范'

type ConfigType = {
  id?: number
  interfaceDescription?: string
  interfaceNorm?: string
}

const sc = scopedClasses('service-config-digital-app-interface');

export default () => {
  const [activeTab, setActiveTab] = useState<string>('应用接口说明')
  
  const [pageLoading, setPageLoading] = useState<boolean>(true)

  const [configInfo, setConfigInfo] = useState<ConfigType>()

  // 应用接口说明
  const [interfaceDescription, setInterfaceDescription] = useState<{ editing: boolean, loading?: boolean }>({ editing: false, loading: false })
  // 接口规范
  const [interfaceNorm, setInterfaceNorm] = useState<{ editing: boolean, loading?: boolean }>({ editing: false, loading: false })

  const [descForm] = Form.useForm()
  const [normForm] = Form.useForm()
  
  useEffect(() => {
    getInterfaceInfo()
  }, [])

  async function getInterfaceInfo() {
    try {
      setPageLoading(true)
      const { result, code } = await getInterfaceConfig();
      if (code === 0) {
        setConfigInfo(result || {})
      } else {
        message.error(`请求数据失败`);
      }
      setPageLoading(false)
    } catch (error) {
      setPageLoading(false)
      message.error('请求数据失败')
    }
  }

  async function handleSave(type: InterfaceType) {
    switch (type) {
      case '应用接口说明':
        {
          await descForm?.validateFields()
          const info: ConfigType = descForm?.getFieldsValue() || {}
          info.id = configInfo?.id
          info.interfaceNorm = configInfo?.interfaceNorm
          setInterfaceDescription({ editing: true, loading: true })
          try {
            const res = await (info.id ? updateInterfaceConfig(info) : addInterfaceConfig(info))
            if (res?.code === 0) {
              message.success('保存成功')
              await getInterfaceInfo()
              setInterfaceDescription({ editing: false, loading: true })
            } else {
              throw new Error('保存失败')
            }
          } catch (error) {
            setInterfaceDescription({ editing: true, loading: true })
            message.error('操作失败，请重试')
          }
        }
        break;
      case 'API接口规范':
        {
          await normForm?.validateFields()
          const info: ConfigType = normForm?.getFieldsValue() || {}
          info.id = configInfo?.id
          info.interfaceDescription = configInfo?.interfaceDescription
          setInterfaceNorm({ editing: true, loading: true })
          try {
            const res = await (info.id ? updateInterfaceConfig(info) : addInterfaceConfig(info))
            if (res?.code === 0) {
              message.success('保存成功')
              await getInterfaceInfo()
              setInterfaceNorm({ editing: false, loading: true })
            } else {
              throw new Error('保存失败')
            }
          } catch (error) {
            setInterfaceNorm({ editing: true, loading: true })
            message.error('操作失败，请重试')
          }
        }
        break;
      default:
        break
    }
  }

  return (
    !configInfo ? (
      <div className={sc('')}>
        {
          pageLoading ? (<Spin className='loading'></Spin>): (<Empty description="暂无数据，请返回重试！"></Empty>)
        }
      </div>
    ) : (
      <div className={sc('container')}>
        <Tabs defaultActiveKey="应用接口说明" activeKey={activeTab} onChange={(e: string) => setActiveTab(e as InterfaceType) }>
          <Tabs.TabPane tab="应用接口说明" key="应用接口说明">
            <div className='action'>
              {
                interfaceDescription.editing ? (
                  <Space>
                    <Button
                      type='primary'
                      onClick={() => {
                        setInterfaceDescription({ editing: false })
                      }}
                    >
                      取消
                    </Button>
                    <Button
                      type='primary'
                      loading={interfaceDescription.loading}
                      onClick={() => handleSave('应用接口说明')}
                    >
                      保存
                    </Button>
                  </Space>
                ) : (
                  <Button type='primary'
                    onClick={() => {
                      setInterfaceDescription({ editing: true })
                      descForm.setFieldsValue({
                        interfaceDescription: configInfo?.interfaceDescription
                      })
                    }}>
                      编辑
                  </Button>
                )
              }
            </div>
            <Form
              style={{ display: interfaceDescription.editing ? 'block' : 'none' }}
              labelCol={{ span: 3 }}
              wrapperCol={{ span: 16 }}
              form={descForm}
              layout="horizontal"
            >
              <Form.Item
                style={{marginBottom: '30px'}}
                name="interfaceDescription"
                rules={[{ required: true }]}
                label="应用接口说明"
              >
                <FormEdit />
              </Form.Item>
            </Form>
            <div style={{ display: interfaceDescription.editing ? 'none' : 'block' }}>
              <Row gutter={24} style={{marginBottom: '30px'}}>
                <Col className='row-label'>应用接口说明：</Col>
                <Col flex={1} className="ck-content" dangerouslySetInnerHTML={{ __html: configInfo.interfaceDescription || '/' }}></Col>
              </Row>
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane tab="API接口规范" key="API接口规范">
            <div className='action'>
              {
                interfaceNorm.editing ? (
                  <Space>
                    <Button
                      type='primary'
                      onClick={() => {
                        setInterfaceNorm({ editing: false })
                      }}
                    >
                      取消
                    </Button>
                    <Button
                      type='primary'
                      loading={interfaceNorm.loading}
                      onClick={() => handleSave('API接口规范')}
                    >
                      保存
                    </Button>
                  </Space>
                ) : (
                  <Button type='primary'
                    onClick={() => {
                      setInterfaceNorm({ editing: true })
                      normForm.setFieldsValue({
                        interfaceNorm: configInfo?.interfaceNorm
                      })
                    }}>
                      编辑
                  </Button>
                )
              }
            </div>
            <Form
              style={{ display: interfaceNorm.editing ? 'block' : 'none' }}
              labelCol={{ span: 3 }}
              wrapperCol={{ span: 16 }}
              form={normForm}
              layout="horizontal"
            >
              <Form.Item
                style={{marginBottom: '30px'}}
                rules={[{ required: true }]}
                name="interfaceNorm"
                label="API接口规范"
              >
                <FormEdit />
              </Form.Item>
            </Form>
            <div style={{ display: interfaceNorm.editing ? 'none' : 'block' }}>
              <Row gutter={24} style={{marginBottom: '30px'}}>
                <Col className='row-label'>API接口规范：</Col>
                <Col flex={1} className="ck-content" dangerouslySetInnerHTML={{ __html: configInfo.interfaceNorm || '/' }}></Col>
              </Row>
            </div>
          </Tabs.TabPane>
        </Tabs>
      </div>
    )
  )
}