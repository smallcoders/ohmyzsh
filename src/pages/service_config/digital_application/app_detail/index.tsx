import './index.less';
import scopedClasses from '@/utils/scopedClasses';
import { PageContainer } from '@ant-design/pro-layout';
import { useEffect, useState } from 'react';
import { message, Empty, Spin, Row, Col } from 'antd';

import useQuery from '@/hooks/useQuery';

import ApplicationManager from '@/types/service-config-digital-applictaion.d';

import {
  getApplicationInfo
} from '@/services/digital-application';

const sc = scopedClasses('service-config-digital-app-detail');

export default () => {

  const query = useQuery();

  const [pageLoading, setPageLoading] = useState<boolean>(true)

  const [detailInfo, setDetailInfo] = useState<ApplicationManager.Content>()

  async function getApplicationDetail(id: string) {
    try {
      setPageLoading(true)
      const { result, code } = await getApplicationInfo({ id });
      if (code === 0) {
        if (result.isDelete !== 1) {
          setDetailInfo(result)
        }
      } else {
        message.error(`请求数据失败`);
      }
      setPageLoading(false)
    } catch (error) {
      setPageLoading(false)
      message.error('请求数据失败')
    }
  }

  useEffect(() => {
    if (query.id) getApplicationDetail(query.id)
  }, [query])

  return (
    <PageContainer
      title="应用详情"
    >
      {
        !detailInfo ? (
          <div className={sc('')}>
            {
              pageLoading ? (<Spin className='loading'></Spin>): (<Empty description="暂无数据，请返回重试！"></Empty>)
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
                <span className='name'>应用方式：</span><span className='content'>{ApplicationManager.TypeText[detailInfo.type!]}</span>
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
                  </div>
                ) : null
              }
              {
                (detailInfo.appType === ApplicationManager.TypeEnum.Web || detailInfo.appType === ApplicationManager.TypeEnum.ALL) ? (
                  <div className='info-row'>
                    <span className='name'>网页端（Web）应用地址：</span><span className='content'>{detailInfo.pcHomeUrl}</span>
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