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
export default () => {
  const { id } = history.location.query as RouterParams
  const [detail, setDetail] = useState<any>([
    {
      label: '活动名称：',
      value: '全明星活动'
    },
    {
      label: '图片：',
      value: <Image src='' alt='' />
    },
    {
      label: '倒计时时长：',
      value: '3秒'
    }
  ])
  const perpaer = async () => {
    if (!id) return
    try {
      const res = await httpMngDetail(id)
      if (res?.code === 0) {
        setDetail(res?.result)
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
        <div className={sc('container-content-header')}>开平广告信息</div>
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