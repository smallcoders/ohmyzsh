import {
  Button,
  message,
  Avatar,
} from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { history, Access, useAccess } from 'umi';
import './index.less'
import scopedClasses from '@/utils/scopedClasses';
import { UserOutlined } from '@ant-design/icons';
import { httpEnterpriseDetail } from '@/services/user-posting';

const sc = scopedClasses('verify-user-posting-detail');
// 内容类型
const contentType = {
  '1': '供需简讯',
  '2': '企业动态',
  '3': '经验分享',
  '4': '供需简讯',
  '5': '供需简讯',
};
const operaObj = { ADD: '新增', MODIFY: '修改', DOWN: '下架', UP: '上架', DELETE: '删除', TOPPING: '置顶', CANCEL_TOPPING: '取消置顶', AUDIT: '自动审核', STAGING: '暂存', AUDIT_PASS: '审核通过', AUDIT_NOT_PASS: '审核不通过', RECOMMEND: '推荐', CANCEL_RECOMMEND: '取消推荐' }
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
      if (res?. code === 0) {
        setDetail(res?.result)
        setAssociationLog(res?.result?.operationRecords)
      } else {
        message.error(`获取详情失败:${res?.message}`)
      }
    } catch (error) {
      message.error(`获取详情失败 ${error}`)
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
          <span>{detail?.content || '--'}</span>
        </div>
        <div className={sc('container-content-desc')}>
          <span>标题：</span>
          <span>{detail?.title || '--'}</span>
        </div>
        <div className={sc('container-content-desc')}>
          <span>关联话题：</span>
          <span>{detail?.topic || '--'}</span>
        </div>
        <div className={sc('container-content-desc')}>
          <span>内容类型：</span>
          <span>{(detail?.publishType && contentType[detail?.publishType]) || '--'}</span>
        </div>
        <div className={sc('container-content-desc')}>
          <span>链接：</span>
          <span>{detail?.title || '--'}</span>
        </div>
        <div className={sc('container-content-desc')}>
          <span>发布时间：</span>
          <span>{detail?.publishTime || '--'}</span>
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
          <span>审核状态：</span>
          <span>{detail?.title || '--'}</span>
        </div>
      </div>
      <div className={sc('container-publisher')}>
        <div className={sc('container-publisher-title')}>发布人信息</div>
        <div className={sc('container-publisher-desc')}>
          <span>发布用户：</span>
          <span>{detail?.userInfo?.userName || '--'}</span>
        </div>
        <div className={sc('container-publisher-desc')}>
          <span>所属组织：</span>
          <span>{detail?.userInfo?.orgName || '--'}</span>
        </div>
        <div className={sc('container-publisher-desc')}>
          <span>联系方式：</span>
          <span>{detail?.userInfo?.phone || '--'}</span>
        </div>
      </div>
      {
        associationLog &&
        <div className={sc('container-topic')}>
          <div className={sc('container-topic-title')}>操作日志</div>
          <div className="operation-log">
            { associationLog?.map((p: any) => {
              return (
                <div style={{ display: 'grid', gridTemplateColumns: '150px 150px 150px', gap: 50, marginBottom: 20}}>
                <div>
                  <Avatar icon={<UserOutlined />} />
                  <span style={{ marginLeft: 10 }}>{p?.userName}</span>
                </div>

                <div style={{ display: 'grid' }}>
                  <span style={{ color: p?.autoAuditResult ? 'red' : 'initial' }}>
                    {operaObj[p?.operation] || '--'}
                  </span>
                  {p?.autoAuditResult && (
                    <span style={{ color: 'red' }}>{p?.autoAuditResult}</span>
                  )}
                </div>

                <span>
                  {p?.createTime ? moment(p?.createTime).format('YYYY-MM-DD HH:mm:ss') : '--'}
                </span>
              </div>
              );
            })}
          </div>
        </div>
      }
    </PageContainer>
  )
}