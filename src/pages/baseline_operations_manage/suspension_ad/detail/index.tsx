import { Button, Image, message as antdMessage } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import React, { useEffect, useState } from 'react';
import { history } from 'umi';
import { getGlobalFloatAdDetail } from '@/services/baseline';
import './index.less';
import scopedClasses from '@/utils/scopedClasses';
import { routeName } from '../../../../../config/routes';

const sc = scopedClasses('suspension-ad-detail');

const scopeMap = {
  'ALL_USER': '全部用户',
  'ALL_LOGIN_USER': '全部登陆用户',
  'ALL_NOT_LOGIN_USER': '全部未登录用户',
}

export default () => {
  const { id } = history.location.query as { id: string | undefined };
  const [detail, setDetail] = useState<any>({})
  useEffect(() => {
    if (id){
      getGlobalFloatAdDetail(id).then((res) => {
        const { result, code, message: resultMsg } = res || {};
        if (code === 0) {
          console.log(result)
          setDetail(result)
        } else {
          antdMessage.error(`请求失败，原因:{${resultMsg}}`);
        }
      });
    }
  }, [])
  return (
    <PageContainer
      className={sc('container')}
      footer={[
        <Button size="large" onClick={() => history.push(routeName.BASELINE_OPERATIONS_MANAGEMENT_SUSPENSION_AD)}>
          返回
        </Button>,
      ]}
    >
      <div className="content">
        <div className="content-title">全局悬浮窗广告详情</div>
        <div className="item">
          <div className="label">活动名称:</div>
          <div className="value">{detail.advertiseName || '--'}</div>
        </div>
        <div className="item">
          <div className="label">图片:</div>
          <div className="value">
            {
              detail?.ossUrls ? detail?.ossUrls?.map((item: any, index: number) => {
                return (
                  <div className="img-box">
                    <Image
                      key={index}
                      className={'banner-img'}
                      src={item}
                      alt="图片损坏"
                    />
                  </div>
                )
              }) : '--'
            }
          </div>
        </div>
        <div className="item">
          <div className="label">站内链接配置:</div>
          <div className="value">{detail.siteLink || '--'}</div>
        </div>
        <div className="item">
          <div className="label">作用范围:</div>
          <div className="value">
            {
              detail?.scope ? detail.scope !== 'PORTION_USER' ? scopeMap[detail.scope] :
                <div>{
                  detail.labels.map((item: any, index: number) => {
                    return <span className="user-label" key={index}>{item.labelName}</span>
                  })
                }</div>
                : ''
            }
          </div>
        </div>
        <div className="item">
          <div className="label">触发页面:</div>
          <div className="value">
            {detail?.triggerAddress || '--'}
          </div>
        </div>
      </div>
    </PageContainer>
  )
}
