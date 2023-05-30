import React, { useState, useEffect } from 'react';
import { Button, Affix, Breadcrumb, message } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import scopedClasses from '@/utils/scopedClasses';
import { Link, history } from 'umi';
import PhoneHeader from '@/assets/service/phone-header.png';
import './index.less';
import {
  httpServiceAccountArticleDetail,
  httpServiceAccountArticleLogList,
} from '@/services/service-management';
import {routeName} from '../../../../../../config/routes'
const sc = scopedClasses('service-collection-detail');

type RouterParams = {
  appId?: string;
  type?: string;
  state?: string;
  id?: string;
  name?: string;
};
export default () => {

  // 根据路由获取参数
  const {
    type,
    state = 'tuwen',
    id,
    name = '',
    backid,
    backname,
    activeTab,
  } = history.location.query as RouterParams;

  return (
    <PageContainer
      className={sc('container')}
      header={{
        title: '详情',
        breadcrumb: (
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to="/baseline/baseline-service-number">服务号管理</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to={`/baseline/baseline-service-number/management?id=${backid}&name=${backname}&activeTabValue=${'合集标签'}`} >合集标签</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>详情</Breadcrumb.Item>
          </Breadcrumb>
        ),
      }}
    >
      

    </PageContainer>
  )
}