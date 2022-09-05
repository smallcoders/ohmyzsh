import './index.less';
import scopedClasses from '@/utils/scopedClasses';
import { PageContainer } from '@ant-design/pro-layout';
import { useEffect, useState } from 'react';
import { message, Empty, Spin, Row, Col, Space, Button } from 'antd';

import useQuery from '@/hooks/useQuery';

import ApplicationManager from '@/types/service-config-digital-applictaion.d';

import AuditModal from '../app_audit/audit-modal'
import type { AuditModalType } from '../app_audit/audit-modal'

import {
  getApplicationInfo,
  getOpenInsideToken
} from '@/services/digital-application';

const sc = scopedClasses('service-config-digital-app-detail');

export default () => {

  const query = useQuery();

  const [pageLoading, setPageLoading] = useState<boolean>(true)

  const [detailInfo, setDetailInfo] = useState<ApplicationManager.Content>()

  // 审核弹窗
  const [showAuditModal, setShowAuditModal] = useState<AuditModalType>({ show: false })

  async function getApplicationDetail(id: string) {
    try {
      setPageLoading(true)
      const { result, code } = await getApplicationInfo({ id });
      if (code === 0) {
        setDetailInfo(result)
      } else {
        message.error(`请求数据失败`);
      }
      setPageLoading(false)
    } catch (error) {
      setPageLoading(false)
      message.error('请求数据失败')
    }
  }

  function handleJumpLink(url: string) {
    getOpenInsideToken().then(({ result, code, message: msg }) => {
      if (code === 0) {
        const token = !~url.indexOf('?') ? `?token=${result}` : `&token=${result}`
        window.open(url + token)
      } else {
        message.error(msg)
      }
    })
  }

  useEffect(() => {
    if (query.id) getApplicationDetail(query.id)
  }, [query])

  return (
    <PageContainer
      title="应用详情"
      extra={
        // 待审核的状态才有
        detailInfo?.state === 3 && (
          <div className='audit-action'>
            <Space>
              <Button
                type="primary"
                onClick={() => {
                  setShowAuditModal({ id: detailInfo.id, action: '审核通过', show: true, typeId: Number(detailInfo.typeId) })
                }}
              >
                通过
              </Button>
              <Button
                onClick={() => setShowAuditModal({ id: detailInfo.id, action: '审核拒绝', show: true })}
              >
                拒绝
              </Button>
            </Space>
            <AuditModal modal={showAuditModal} onCloseModal={(action?: string) => {
              if (action) {
                getApplicationDetail(query.id)
              }
              setShowAuditModal({ show: false })
            }}
            >
            </AuditModal>
          </div>
        )
      }
    >
      {
        (!detailInfo || detailInfo.isDelete) ? (
          <div className={sc('')}>
            {
              pageLoading ? (<Spin className='loading'></Spin>): (<Empty description={!detailInfo ? `暂无数据，请返回重试！` : '该应用已删除！'}></Empty>)
            }
          </div>
        ) : (
          <div className={sc('')}>
            <div className='container'>
              <div className='title'>应用信息</div>
              <div className="info-row">
                <img src={detailInfo.logoImagePath} alt="图片损坏" />
                <div className='info'>
                  <div className='name blod'>{ detailInfo.appName }</div>
                  <div className='content'>{ detailInfo.content }</div>
                </div>
              </div>
              <div className='info-row'>
                <span className='name'>应用类型：</span><span className='content'>{ApplicationManager.TypeText[detailInfo.appType!]}</span>
              </div>
              <div className='info-row'>
                <span className='name'>应用分类：</span><span className='content'>{detailInfo.typeName}</span>
              </div>
              <div className='info-row'>
                <span className='name'>应用方式：</span><span className='content'>{ApplicationManager.DevelopmentText[detailInfo.type!]}</span>
              </div>
            </div>
            <div className='container'>
              <div className='title'>开发管理配置</div>
              <div className='info-row'>
                <span className='name'>服务器出口IP：</span><span className='content'>{detailInfo.exportIp}</span>
              </div>
              {
                (detailInfo.appType === ApplicationManager.TypeEnum.H5 || detailInfo.appType === ApplicationManager.TypeEnum.ALL) ? (
                  <div className='info-row'>
                    <span className='name'>移动端（H5）应用地址：</span><span className='content'>{detailInfo.appHomeUrl}</span>
                    {
                      detailInfo.appHomeUrl && <Button type='link' onClick={() => handleJumpLink(detailInfo.appHomeUrl!)}>查看</Button>
                    }
                  </div>
                ) : null
              }
              {
                (detailInfo.appType === ApplicationManager.TypeEnum.Web || detailInfo.appType === ApplicationManager.TypeEnum.ALL) ? (
                  <div className='info-row'>
                    <span className='name'>网页端（Web）应用地址：</span><span className='content'>{detailInfo.pcHomeUrl}</span>
                    {
                      detailInfo.pcHomeUrl && <Button type='link' onClick={() => handleJumpLink(detailInfo.pcHomeUrl!)}>查看</Button>
                    }
                  </div>
                ) : null
              }
            </div>
            <div className='container'>
              <div className='title'>应用介绍配置</div>
              <Row gutter={24} style={{marginBottom: '30px'}}>
                <Col className='row-label'>应用介绍：</Col>
                <Col flex={1} dangerouslySetInnerHTML={{ __html: detailInfo.descs || '/' }}></Col>
              </Row>
              <Row gutter={24} style={{marginBottom: '30px'}}>
                <Col className='row-label'>应用价值：</Col>
                <Col flex={1} dangerouslySetInnerHTML={{ __html: detailInfo.worth || '/' }}></Col>
              </Row>
              <Row gutter={24}>
                <Col className='row-label'>应用场景：</Col>
                <Col flex={1} dangerouslySetInnerHTML={{ __html: detailInfo.scene || '/' }}></Col>
              </Row>
            </div>
          </div>
        )
      }
    </PageContainer>
  )
}