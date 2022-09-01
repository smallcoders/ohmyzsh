import './index.less';
import scopedClasses from '@/utils/scopedClasses';
import { useEffect, useState } from 'react';

import { Button, Tabs, Space, Spin, message, Modal, Form, Select, Input, Row, Col, Tooltip } from 'antd';
import { history } from 'umi';

import { routeName } from '../../../../../config/routes';

import SelfTable from '@/components/self_table';
import Common from '@/types/common';

const sc = scopedClasses('service-config-digital-app-audit');

import ApplicationManager from '@/types/service-config-digital-applictaion';

import type { ColumnsType } from 'antd/es/table';

import AuditModal from './audit-modal'
import type { AuditModalType } from './audit-modal'

import {
  getApplyInfoPage
} from '@/services/digital-application';

type AuditType = '待审核'|'审核通过'|'审核拒绝'

export default () => {
  const [activeTab, setActiveTab] = useState<AuditType>('待审核')
  // 各个列表
  const [auditingList, setAuditingList] = useState<ApplicationManager.Content[]>([]);
  const [auditSuccessList, setAuditSuccessList] = useState<ApplicationManager.Content[]>([]);
  const [auditFailList, setAuditFailList] = useState<ApplicationManager.Content[]>([]);
  // 各个loading
  const [auditingLoading, setAuditingLoading] = useState<boolean>(false);
  const [auditSuccessLoading, setAuditSuccessLoading] = useState<boolean>(false);
  const [auditFailLoading, setAuditFailLoading] = useState<boolean>(false);
  // 各个 search
  const [auditingSearch, setAuditingSearch] = useState<{ appName: string }>({ appName: '' });
  const [auditSuccessSearch, setAuditSuccessSearch] = useState<{ appName: string }>({ appName: '' });
  const [auditFailSearch, setAuditFailSearch] = useState<{ appName: string }>({ appName: '' });
  // 各个分页信息
  const [auditingPageInfo, setAuditingPageInfo] = useState<Common.ResultPage>({ pageIndex: 1, pageSize: 10, totalCount: 0, pageTotal: 0 });
  const [auditSuccessPageInfo, setAuditSuccessPageInfo] = useState<Common.ResultPage>({ pageIndex: 1, pageSize: 10, totalCount: 0, pageTotal: 0 })
  const [auditFailPageInfo, setAuditFailPageInfo] = useState<Common.ResultPage>({ pageIndex: 1, pageSize: 10, totalCount: 0, pageTotal: 0 });

  // 审核弹窗
  const [showAuditModal, setShowAuditModal] = useState<AuditModalType>({ show: false })

  useEffect(() => {
    getAuditingList()
  }, [auditingSearch])

  useEffect(() => {
    getAuditSuccessList()
  }, [auditSuccessSearch])

  useEffect(() => {
    getAuditFailList()
  }, [auditFailSearch])

  // 审核失败列表
  async function getAuditingList(pageIndex: number = 1, pageSize = auditingPageInfo.pageSize) {
    try {
      setAuditingLoading(true)
      const { result, totalCount, pageTotal, code } = await getApplyInfoPage({
        pageIndex,
        pageSize,
        handleResult: 0,
        isHandle: 0,
        ...auditingSearch
      });
      if (code === 0) {
        setAuditingPageInfo({ totalCount, pageTotal, pageIndex, pageSize });
        setAuditingList(result);
      } else {
        message.error(`请求分页数据失败`);
      }
      setAuditingLoading(false)
    } catch (error) {
      setAuditingLoading(false)
      console.log(error);
    }
  }

  // 审核成功列表
  async function getAuditSuccessList(pageIndex: number = 1, pageSize = auditSuccessPageInfo.pageSize) {
    try {
      setAuditSuccessLoading(true)
      const { result, totalCount, pageTotal, code } = await getApplyInfoPage({
        pageIndex,
        pageSize,
        handleResult: 1,
        isHandle: 1,
        ...auditSuccessSearch
      });
      if (code === 0) {
        setAuditSuccessPageInfo({ totalCount, pageTotal, pageIndex, pageSize });
        setAuditSuccessList(result);
      } else {
        message.error(`请求分页数据失败`)
      }
      setAuditSuccessLoading(false)
    } catch (error) {
      setAuditSuccessLoading(false)
      console.log(error);
    }
  }

  // 审核失败列表
  async function getAuditFailList(pageIndex: number = 1, pageSize = auditFailPageInfo.pageSize) {
    try {
      setAuditFailLoading(true)
      const { result, totalCount, pageTotal, code } = await getApplyInfoPage({
        pageIndex,
        pageSize,
        handleResult: 0,
        isHandle: 1,
        ...auditFailSearch
      });
      if (code === 0) {
        setAuditFailPageInfo({ totalCount, pageTotal, pageIndex, pageSize });
        setAuditFailList(result);
      } else {
        message.error(`请求分页数据失败`)
      }
      setAuditFailLoading(false)
    } catch (error) {
      setAuditFailLoading(false)
      console.log(error);
    }
  }

  const getColumns = (type: AuditType): ColumnsType<ApplicationManager.Content> => {
    const columns: ColumnsType<ApplicationManager.Content> = [
      {
        title: '应用',
        dataIndex: 'title',
        width: 500,
        render: (_: unknown, row: ApplicationManager.Content) => (
          <div className="table-app-row">
            <img src={row.logoImagePath} alt="图片损坏" />
            <div className='info'>
              <Tooltip title={row.appName}>
                <span onClick={() => {
                  history.push(`${routeName.DIGITAL_APPLICATION_DETAIL}?id=${row.id}`)
                }}>{ row.appName }</span>
              </Tooltip>
              <Tooltip title={row.content} placement="right">
                <span>{ row.content }</span>
              </Tooltip>
            </div>
          </div>
        ),
      },
      { title: '申请组织', dataIndex: 'orgName', width: 150 },
      { title: '申请人', dataIndex: 'userName', width: 150 },
      { title: '申请时间', dataIndex: 'createTime', width: 200 },
    ]

    switch (type) {
      case '待审核':
        columns.push({
          title: '操作',
          width: 130,
          fixed: 'right',
          dataIndex: 'option',
          render: (_: unknown, row: ApplicationManager.Content) => {
            return (
              <Space>
                <Button
                  type="link"
                  onClick={() => {
                    setShowAuditModal({ id: row.id, action: '审核通过', show: true, typeId: Number(row.typeId) })
                  }}
                >
                  通过
                </Button>
                <Button
                  type="link"
                  onClick={() => setShowAuditModal({ id: row.id, action: '审核拒绝', show: true })}
                >
                  拒绝
                </Button>
              </Space>
            );
          },
        })
        break
      case '审核通过':
        columns.push({ title: '审核通过时间', dataIndex: 'updateTime', width: 200, fixed: 'right' })
        break;
      case '审核拒绝':
        columns.push({
          title: '拒绝理由',
          dataIndex: 'handleReason',
          width: 300,
          fixed: 'right',
          render: (_: any, row: ApplicationManager.Content) => (
            <Tooltip title={row.handleReason}>
              <span className={sc('ellipsis2')}>{row.handleReason}</span>
            </Tooltip>
          )
        })
        break;
      default:
        break;
    }

    return columns
  }

  // 搜索表单
  const createSearchForm = (type: AuditType) => {
    const [searchForm] = Form.useForm();

    function handleSearch() {
      const search = searchForm.getFieldsValue();
      switch (type) {
        case '待审核':
          setAuditingSearch(search)
          break;
        case '审核通过':
          setAuditSuccessSearch(search)
          break;
        case '审核拒绝':
          setAuditFailSearch(search)
          break;
        default:
          break;
      }
    }

    function handleReset() {
      searchForm.resetFields()
      handleSearch()
    }
    
    return (
      <div className={sc('container-search')}>
        <Form form={searchForm}>
          <Row justify="space-between">
            <Col>
              <Form.Item name="appName" label="应用名称">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col>
              <Button
                style={{ marginRight: 20 }}
                type="primary"
                onClick={handleSearch}
              >
                查询
              </Button>
              <Button
                type="primary"
                onClick={handleReset}
              >
                重置
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }

  return (
    <div
      className={sc('container')}
    >
      <div className='title'>应用审核列表</div>
      <Tabs defaultActiveKey="待审核" activeKey={activeTab} onChange={(e: string) => setActiveTab(e as AuditType) }>
        <Tabs.TabPane tab="待审核" key="待审核">
          {createSearchForm('待审核')}
          <Spin spinning={auditingLoading}>
            <SelfTable
              rowKey={'id'}
              columns={getColumns('待审核')}
              scroll={{ x: 1300 }}
              pagination={
                auditingPageInfo.totalCount === 0
                  ? false
                  : {
                      onChange: getAuditingList,
                      total: auditingPageInfo.totalCount,
                      showSizeChanger: true,
                      showQuickJumper: true,
                      current: auditingPageInfo.pageIndex,
                      pageSize: auditingPageInfo.pageSize,
                      showTotal: (total: number) =>
                        `共${total}条记录 第${auditingPageInfo.pageIndex}/${auditingPageInfo.pageTotal || 1}页`,
                    }
              }
              dataSource={auditingList}
            />
          </Spin>
          <AuditModal modal={showAuditModal} onCloseModal={(action?: string) => {
            if (action) {
              getAuditingList()
              action === '审核通过' ? getAuditSuccessList() : getAuditFailList()
            }
            setShowAuditModal({ show: false })
          }}
          >
          </AuditModal>
        </Tabs.TabPane>
        <Tabs.TabPane tab="审核通过" key="审核通过">
          {createSearchForm('审核通过')}
          <Spin spinning={auditSuccessLoading}>
            <SelfTable
              rowKey={'id'}
              columns={getColumns('审核通过')}
              scroll={{ x: 1300 }}
              pagination={
                auditSuccessPageInfo.totalCount === 0
                  ? false
                  : {
                      onChange: getAuditSuccessList,
                      total: auditSuccessPageInfo.totalCount,
                      showSizeChanger: true,
                      showQuickJumper: true,
                      current: auditSuccessPageInfo.pageIndex,
                      pageSize: auditSuccessPageInfo.pageSize,
                      showTotal: (total: number) =>
                        `共${total}条记录 第${auditSuccessPageInfo.pageIndex}/${auditSuccessPageInfo.pageTotal || 1}页`,
                    }
              }
              dataSource={auditSuccessList}
            />
          </Spin>
        </Tabs.TabPane>
        <Tabs.TabPane tab="审核拒绝" key="审核拒绝">
          {createSearchForm('审核拒绝')}
          <Spin spinning={auditFailLoading}>
            <SelfTable
              rowKey={'id'}
              columns={getColumns('审核拒绝')}
              scroll={{ x: 1300 }}
              pagination={
                auditFailPageInfo.totalCount === 0
                  ? false
                  : {
                      onChange: getAuditFailList,
                      total: auditFailPageInfo.totalCount,
                      showSizeChanger: true,
                      showQuickJumper: true,
                      current: auditFailPageInfo.pageIndex,
                      pageSize: auditFailPageInfo.pageSize,
                      showTotal: (total: number) =>
                        `共${total}条记录 第${auditFailPageInfo.pageIndex}/${auditFailPageInfo.pageTotal || 1}页`,
                    }
              }
              dataSource={auditFailList}
            />
          </Spin>
        </Tabs.TabPane>
      </Tabs>
    </div>
  )
}