import { PageContainer } from '@ant-design/pro-layout';
import {Button, Tag} from 'antd'
import {history} from "@@/core/history";
import  {useEffect,useState} from "react";
import './index.less';
import {getOrgDetail} from '@/services/org-type-manage'

export default () => {
const [orgManageInfo,setOrgManageInfo] = useState<any>({})
const [industryText,setIndustryText] = useState<any>('')
const scaleList =['0～50人','50～100人','100～200人','200～500人','500人以上']
const orgId = history.location.query?.id as string;
const getDetail = () =>{
 getOrgDetail(orgId).then(res=>{
  if(res.code === 0){
    setOrgManageInfo(res?.result)
    if(res?.result.industryTxtList){
      const concatChildren = res?.result.industryTxtList.map((e: any) => e).join('、');
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
    <div className='org-manage-info' >
          <div  className='org-manage-info-col'>
            <div className='org-manage-info-col-label'>营业执照：</div>
            <div className='org-manage-info-col-title'>
              <div>(事业单位法人证书或统一信用代码证)</div>
              <img
              src={require('@/assets/banking_loan/delete.png')}
              alt=""
              className="org-manage-info-col-title-img"
            />
            </div>
          </div>
          <div  className='org-manage-info-col'>
            <div className='org-manage-info-col-label'>统一信用代码：</div>
            <div className='org-manage-info-col-title'>{orgManageInfo?.creditCode || '--'}</div>
          </div>
          <div  className='org-manage-info-col'>
            <div className='org-manage-info-col-label'>组织类型：</div>
            <div className='org-manage-info-col-title'>{orgManageInfo?.orgTypeName || '--'}</div>
          </div>
          <div  className='org-manage-info-col'>
            <div className='org-manage-info-col-label'>公司全称：</div>
            <div className='org-manage-info-col-title'>{orgManageInfo?.orgName || '--'}</div>
          </div>
          <div  className='org-manage-info-col'>
            <div className='org-manage-info-col-label'>组织标签：</div>
            <div className='org-manage-info-col-title'>{orgManageInfo?.industryCategoryName?<Tag color="#108ee9">{orgManageInfo?.industryCategoryName}</Tag>:'--'}</div>
          </div>
          <div  className='org-manage-info-col'>
            <div className='org-manage-info-col-label'>法人：</div>
            <div className='org-manage-info-col-title'>{orgManageInfo?.legalName || '--'}</div>
          </div>
          <div  className='org-manage-info-col'>
            <div className='org-manage-info-col-label'>注册区域：</div>
            <div className='org-manage-info-col-title'>{orgManageInfo?.areaName || '--'}</div>
          </div>
          <div  className='org-manage-info-col'>
            <div className='org-manage-info-col-label'>注册时间：</div>
            <div className='org-manage-info-col-title'>{orgManageInfo?.registerDate || '--'}</div>
          </div>
          <div  className='org-manage-info-col'>
            <div className='org-manage-info-col-label'>成立时间：</div>
            <div className='org-manage-info-col-title'>{orgManageInfo?.formedDate || '--'}</div>
          </div>
          <div  className='org-manage-info-col'>
            <div className='org-manage-info-col-label'>企业规模：</div>
            <div className='org-manage-info-col-title'>{scaleList[orgManageInfo?.scale] || '--'}</div>
          </div>
          <div  className='org-manage-info-col'>
            <div className='org-manage-info-col-label'>经营范围：</div>
            <div className='org-manage-info-col-title'>{orgManageInfo?.businessScope || '--'}</div>
          </div>
          <div  className='org-manage-info-col'>
            <div className='org-manage-info-col-label'>主营行业：</div>
            <div className='org-manage-info-col-title'>{industryText || '--'}</div>
          </div>
          <div  className='org-manage-info-col'>
            <div className='org-manage-info-col-label'>注册资本：</div>
            <div className='org-manage-info-col-title'>{orgManageInfo?.registeredCapital || '--'}</div>
          </div>
          <div  className='org-manage-info-col'>
            <div className='org-manage-info-col-label'>企业类型：</div>
            <div className='org-manage-info-col-title'>{orgManageInfo?.entTypeName || '--'}</div>
          </div>
          <div  className='org-manage-info-col'>
            <div className='org-manage-info-col-label'>工商注册号：</div>
            <div className='org-manage-info-col-title'>{orgManageInfo?.regCode || '--'}</div>
          </div>
          <div  className='org-manage-info-col'>
            <div className='org-manage-info-col-label'>组织机构代码：</div>
            <div className='org-manage-info-col-title'>{orgManageInfo?.orgNo || '--'}</div>
          </div>
          <div  className='org-manage-info-col'>
            <div className='org-manage-info-col-label'>纳税人识别号：</div>
            <div className='org-manage-info-col-title'>{orgManageInfo?.taxNo || '--'}</div>
          </div>
          <div  className='org-manage-info-col'>
            <div className='org-manage-info-col-label'>纳税人资质：</div>
            <div className='org-manage-info-col-title'>{orgManageInfo?.qualification || '--'}</div>
          </div>
          <div  className='org-manage-info-col'>
            <div className='org-manage-info-col-label'>营业期限：</div>
            <div className='org-manage-info-col-title'>{orgManageInfo?.openTime || '--'}</div>
          </div>
          <div  className='org-manage-info-col'>
            <div className='org-manage-info-col-label'>登记机关：</div>
            <div className='org-manage-info-col-title'>{orgManageInfo?.authorityName || '--'}</div>
          </div>
          <div  className='org-manage-info-col'>
            <div className='org-manage-info-col-label'>标注情况：</div>
            <div className='org-manage-info-col-title'>{orgManageInfo?.orgSignName || '--'}</div>
          </div>
        </div>
   </PageContainer>
  )
}
