import { PageContainer } from '@ant-design/pro-layout';
import { Button, Tag } from 'antd'
import { history } from "@@/core/history";
import { useEffect, useState } from "react";
import './index.less';
import { getOrgDetail } from '@/services/org-type-manage'

export default () => {
  const [orgManageInfo, setOrgManageInfo] = useState<any>({})
  const [industryText, setIndustryText] = useState<any>('')
  const scaleList = ['0～50人', '50～100人', '100～200人', '200～500人', '500人以上']
  const orgId = history.location.query?.id as string;

  const getDetail = () => {
    getOrgDetail(orgId).then(res => {
      if (res.code === 0) {
        setOrgManageInfo(res?.result)
        if (res?.result?.industryTxtList) {
          const concatChildren = res?.result?.industryTxtList.map((e: any) => e).join('、');
          setIndustryText(concatChildren)
        }
      }
    })
  }
  
  useEffect(() => {
    getDetail()
  }, [])

  return (
    <PageContainer
      footer={[
        <>
          <Button size="large" onClick={() => history.goBack()}>
            返回
          </Button>
        </>
      ]}
    >
      <div className='trade-manage-info' >
        <div className='trade-manage-info-col'>
          <div className='trade-manage-info-col-label'>订单日期：</div>
          <div className='trade-manage-info-col-title'>{orgManageInfo?.creditCode || '--'}</div>
        </div>
        <div className='trade-manage-info-col'>
          <div className='trade-manage-info-col-label'>采购单号：</div>
          <div className='trade-manage-info-col-title'>{orgManageInfo?.orgTypeName || '--'}</div>
        </div>
        <div className='trade-manage-info-col'>
          <div className='trade-manage-info-col-label'>项目名称：</div>
          <div className='trade-manage-info-col-title'>{orgManageInfo?.orgName || '--'}</div>
        </div>
        <div className='trade-manage-info-col'>
          <div className='trade-manage-info-col-label'>合同主体：</div>
          <div className='trade-manage-info-col-title'>{orgManageInfo?.industryCategoryName ? <Tag color="#108ee9">{orgManageInfo?.industryCategoryName}</Tag> : '--'}</div>
        </div>
        <div className='trade-manage-info-col'>
          <div className='trade-manage-info-col-label'>供应商名称：</div>
          <div className='trade-manage-info-col-title'>{orgManageInfo?.legalName || '--'}</div>
        </div>
        <div className='trade-manage-info-col'>
          <div className='trade-manage-info-col-label'>物料描述：</div>
          <div className='trade-manage-info-col-title'>{orgManageInfo?.areaName || '--'}</div>
        </div>
        <div className='trade-manage-info-col'>
          <div className='trade-manage-info-col-label'>数量：</div>
          <div className='trade-manage-info-col-title'>{orgManageInfo?.formedDate || '--'}</div>
        </div>
        <div className='trade-manage-info-col'>
          <div className='trade-manage-info-col-label'>单位：</div>
          <div className='trade-manage-info-col-title'>{scaleList[orgManageInfo?.scale] || '--'}</div>
        </div>
        <div className='trade-manage-info-col'>
          <div className='trade-manage-info-col-label'>单价：</div>
          <div className='trade-manage-info-col-title'>{orgManageInfo?.businessScope || '--'}</div>
        </div>
        <div className='trade-manage-info-col'>
          <div className='trade-manage-info-col-label'>价格单位：</div>
          <div className='trade-manage-info-col-title'>{industryText || '--'}</div>
        </div>
        <div className='trade-manage-info-col'>
          <div className='trade-manage-info-col-label'>含税金额（元）：</div>
          <div className='trade-manage-info-col-title'>{orgManageInfo?.registeredCapital || '--'}</div>
        </div>
        <div className='trade-manage-info-col'>
          <div className='trade-manage-info-col-label'>数据来源：</div>
          <div className='trade-manage-info-col-title'>{orgManageInfo?.entTypeName || '--'}</div>
        </div>
      </div>
    </PageContainer>
  )
}
