import {
  Button,
  message,
} from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { history, Access, useAccess } from 'umi';
import './index.less'
import scopedClasses from '@/utils/scopedClasses';
import { httpEnterpriseDetail } from '@/services/user-posting';

const sc = scopedClasses('baseline-user-posting-detail');

export default () => {
  const { id } = history.location.query as any;

  const [detail, setDetail] = useState<any>()
  // 操作日志
  const [associationLog, setAssociationLog] = useState<any>([]);
  // 初始化
  const perpaer = async () => {
    if (!id) return
    try {
      const res = await httpEnterpriseDetail(id)
      if (res?.code === 0) {
        setDetail(res?.result)
        setAssociationLog(res?.result?.operationRecords)
      }
    } catch (error) {
      message.error(`获取用户发布管理详情失败： ${error}`)
    } 
  }
  useEffect(() => {
    perpaer()
    console.log('详情的路径参数', id)
  },[])

  return (
    <PageContainer 
      className={sc('container')}
      footer={[
        <Button style={{marginRight:'40px'}} onClick={() =>{
        history.goBack()}
        }>返回</Button>
      ]}
    >
      <div className={sc('container-content')}>
        <div className={sc('container-content-title')}>发布内容</div>
        <div className={sc('container-content-desc')}>
          <span>内容：</span>
          <span>{detail?.title || '--'}</span>
        </div>
        <div className={sc('container-content-desc')}>
          <span>标题：</span>
          <span>{detail?.title || '--'}</span>
        </div>
        <div className={sc('container-content-desc')}>
          <span>关联话题：</span>
          <span>{detail?.title || '--'}</span>
        </div>
        <div className={sc('container-content-desc')}>
          <span>内容类型：</span>
          <span>{detail?.title || '--'}</span>
        </div>
        <div className={sc('container-content-desc')}>
          <span>链接：</span>
          <span>{detail?.title || '--'}</span>
        </div>
        <div className={sc('container-content-desc')}>
          <span>发布时间：</span>
          <span>{detail?.title || '--'}</span>
        </div>
        <div className={sc('container-content-desc')}>
          <span>图片：</span>
          <div>
            {/* 根据后端接口调整 */}
            {!detail?.fileIds && <span>--</span>}
            {detail?.fileIds &&  detail?.fileIds?.map((id: any, index: any) => {
              return (
                <img style={{width: 200, height: 200, marginRight: '5px'}} src={`/antelope-common/common/file/download/${id}`} alt="图片损坏"  key={index}/>
              )
            })}
          </div>
        </div>
        <div className={sc('container-content-desc')}>
          <span>上架状态：</span>
          <span>{detail?.title || '--'}</span>
        </div>
        <div className={sc('container-content-desc')}>
          <span>推荐状态：</span>
          <span>{detail?.title || '--'}</span>
        </div>
      </div>
      <div className={sc('container-publisher')}>
        <div className={sc('container-publisher-title')}>发布人信息</div>
        <div className={sc('container-publisher-desc')}>
          <span>发布用户：</span>
          <span>{detail?.name}</span>
        </div>
        <div className={sc('container-publisher-desc')}>
          <span>所属组织：</span>
          <span>{detail?.name}</span>
        </div>
        <div className={sc('container-publisher-desc')}>
          <span>联系方式：</span>
          <span>{detail?.name}</span>
        </div>
      </div>
      <div className={sc('container-topic')}>
        <div className={sc('container-topic-title')}>操作日志</div>
        <div className="operation-log">
          {associationLog && associationLog.map((item: any) => {
            return (
              <div className="operation-log-item">
                <div className="item-userName">{item.name}</div>
                <div className="item-name">{item.content}</div>
                <div className="item-time">{item.createTime}</div>
              </div>
            );
          })}
        </div>
      </div>
    </PageContainer>
  )
}