import { Button, message, Image } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import React, { useEffect, useState } from 'react';
import { history, Access, useAccess } from 'umi';
import './index.less';
import scopedClasses from '@/utils/scopedClasses';
import { routeName } from '../../../../../config/routes';
import { httpMngDetail } from '@/services/home-screen-ad'; 

const sc = scopedClasses('home-screen-ad-detail');

type RouterParams = {
  type?: string;
  id?: string;
};
const displayFrequencyEnum = {
  EVERY_TIME: '每次',
  INTERVAL_ONE_TIME: '间隔一次',
  DAY_THREE_TIMES: '每天最多显示3次',
};
export default () => {
  const { id } = history.location.query as RouterParams
  const [detail, setDetail] = useState<any>()
  const perpaer = async () => {
    if (!id) return
    try {
      const res = await httpMngDetail(id)
      if (res?.code === 0) {
        const {advertiseName, countdown, siteLink, displayFrequency, ossUrls } = res?.result
        const dataSource = [
          {
            label: '活动名称：',
            value: advertiseName || '--'
          },
          {
            label: '图片：',
            value: 
            <div className="img-box" style={{
              display: 'grid',
              gridTemplateColumns: '100px 100px 100px',
              gridColumnGap: '10px',
              gridRowGap: '15px'
            }}>
              {
                ossUrls ? ossUrls?.map((item: any, index: number) => {
                  return (
                    <div className="img-box-item">
                      <Image src={item} key={index} />
                    </div>
                  )
                }) : '--'
              }

            </div>
          },
          {
            label: '倒计时时长：',
            value: countdown + 'S' || '--',
          },
          {
            label: '广告链接：',
            value: siteLink || '--',
          },
          {
            label: '启动频率：',
            value: displayFrequencyEnum[displayFrequency] || '--',
          },
        ]
        setDetail(dataSource)
      } else {
        message.error(`获取详情失败: ${res?.message}`)
      }
    } catch (error) {
      message.error(`获取详情失败:${error}`)
    }
  }

  useEffect(() => {
    perpaer()
  },[])

  return (
    <PageContainer
      className={sc('container')}
      footer={[
        <Button size="large" onClick={() => history.push(`${routeName.BASELINE_OPERATIONS_MANAGEMENT_HOME_SCREEN_AD}`)}>
          返回
        </Button>,
      ]}
    >
      <div className={sc('container-content')}>
        <div className={sc('container-content-header')}>开屏广告信息</div>
        <div className={sc('container-content-form')}>
          {
            detail?.map((item: any) => {
              return (
                <div className={sc('container-content-form-cell')}>
                  <span>{item.label}</span>
                  <span>{item.value}</span>
                </div>
              )
            })
          }
        </div>
      </div>
    </PageContainer>
  )
}