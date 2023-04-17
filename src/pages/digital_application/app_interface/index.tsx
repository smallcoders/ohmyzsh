import './index.less';
import scopedClasses from '@/utils/scopedClasses';
import { useEffect, useState } from 'react';
import FormEdit from '@/components/FormEdit'
import { Access, useAccess } from 'umi';

import { Button, message, Spin, Empty, Tabs, Space, Form, Row, Col } from 'antd';

import { getInterfaceConfig, updateInterfaceConfig } from '@/services/digital-application';
import { PageContainer } from '@ant-design/pro-layout';

const configs = [
  {
    name: '应用接口说明',
    key: 'interfaceDescription',
  },
  {
    name: '接口规范',
    key: 'interfaceNorm',
  },
  {
    name: 'H5应用接口说明',
    key: 'h5Desc',
  },
  {
    name: '接口错误码说明',
    key: 'errorCodeDesc',
  },
  {
    name: '常规问题解答',
    key: 'questionAnswer',
  },
]


const sc = scopedClasses('digital-application-app-interface');

export default () => {
  const [activeTab, setActiveTab] = useState<string>('interfaceDescription')

  const [pageLoading, setPageLoading] = useState<boolean>(true)

  const [dataSource, setDataSource] = useState<{
    id: string,
    value: string
  }>({
    id: '',
    value: ''
  })

  const [load, setLoad] = useState<{ editing: boolean, loading?: boolean }>({ editing: false, loading: false })

  const [form] = Form.useForm()

  useEffect(() => {
    getInterfaceInfo(activeTab)
  }, [activeTab])

  async function getInterfaceInfo(type = activeTab) {
    try {
      setPageLoading(true)
      const { result, code } = await getInterfaceConfig(type);
      if (code === 0) {
        setDataSource({ id: result?.id, value: result?.[type] || '' })
      } else {
        message.error(`请求数据失败`);
      }
      setPageLoading(false)
    } catch (error) {
      setPageLoading(false)
      message.error('请求数据失败')
    }
  }

  async function handleSave(type: string) {
    await form?.validateFields()
    const info = form?.getFieldsValue() || {}
    setLoad({ editing: true, loading: true })
    try {
      const res = await updateInterfaceConfig({[type]: info?.value, id: dataSource?.id})
      if (res?.code === 0) {
        message.success('保存成功')
        await getInterfaceInfo()
        form.resetFields()
        setLoad({ editing: false, loading: true })
      } else {
        throw new Error('保存失败')
      }
    } catch (error) {
      setLoad({ editing: true, loading: true })
      message.error('操作失败，请重试')
    }
  }

  const access = useAccess()

  return (
    <PageContainer>
      {
        configs?.length === 0 ? (
          <div className={sc('')}>
            {
              pageLoading ? (<Spin className='loading'></Spin>) : (<Empty description="暂无数据，请返回重试！"></Empty>)
            }
          </div>
        ) : (
          <div className={sc('container')}>
            <Tabs defaultActiveKey="interfaceDescription" activeKey={activeTab} onChange={(e: string) => setActiveTab(e as string)}>

              {
                configs?.map(p => (
                  <Tabs.TabPane tab={p.name} key={p.key} disabled={load.editing}>
                    <Access accessible={access['PU_DA_JKGF']}>
                      <div className='action'>
                        {
                          load.editing ? (
                            <Space>
                              <Button
                                type='primary'
                                onClick={() => {
                                  setLoad({ editing: false })
                                }}
                              >
                                取消
                              </Button>
                              <Button
                                type='primary'
                                loading={load.loading}
                                onClick={() => handleSave(p.key)}
                              >
                                保存
                              </Button>
                            </Space>
                          ) : (

                            <Button type='primary'
                              onClick={() => {
                                setLoad({ editing: true })
                                form.setFieldsValue({
                                  value: dataSource.value
                                })
                              }}>
                              编辑
                            </Button>
                          )
                        }
                      </div>
                    </Access>
                    <Form
                      style={{ display: load.editing ? 'block' : 'none' }}
                      labelCol={{ span: 3 }}
                      wrapperCol={{ span: 16 }}
                      form={form}
                      layout="horizontal"
                    >
                      <Form.Item
                        style={{ marginBottom: '30px' }}
                        name="value"
                        rules={[{ required: true }]}
                        label={p.name}
                      >
                        <FormEdit />
                      </Form.Item>
                    </Form>
                    <div style={{ display: load.editing ? 'none' : 'block' }}>
                      <Row gutter={24} style={{ marginBottom: '30px' }}>
                        <Col className='row-label'>{p.name}：</Col>
                        <Col flex={1} className="ck-content" dangerouslySetInnerHTML={{ __html: dataSource.value || '/' }}></Col>
                      </Row>
                    </div>
                  </Tabs.TabPane>
                ))
              }

            </Tabs>
          </div>
        )
      }
    </PageContainer>
  )
}