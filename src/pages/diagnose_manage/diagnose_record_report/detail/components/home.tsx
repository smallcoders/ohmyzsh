/* eslint-disable */
import { observer } from 'mobx-react'
import {  Image } from 'antd';
import '../service-config-diagnose-manage.less';
import scopedClasses from '@/utils/scopedClasses';
import icon1 from '@/assets/system/empty.png';
const sc = scopedClasses('service-config-diagnose-manage');
const hostMap = {
  'http://172.30.33.222:10086': 'http://172.30.33.222',
  'http://172.30.33.212:10086': 'http://172.30.33.212',
  'http://10.103.142.216': 'https://preprod.lingyangplat.com',
  'http://manage.lingyangplat.com': 'https://www.lingyangplat.com',
  'https://manage.lingyangplat.com': 'https://www.lingyangplat.com',
  'http://localhost:8000': 'http://172.30.33.222'
}

export default observer(
  (props: {
    diagnoseRes: any
  }) => {
    const { diagnoseRes = {} } = props || {}
    console.log(diagnoseRes, '-----diagnoseRes')
    const getLink = (id: string) => {
      const { origin } = window.location
      return `${hostMap[origin]}/front/financial-service/detail?productId=${id}`
        // return `${hostMap[origin]}${hostMap[origin].indexOf('lingyangplat')!== -1 ? '/front' : ''}/template-page?id=${id}&login=${publishType === '公开发布' ? '' : '1'}`
    }
    const toProductDetail = (id: string) => {
      console.log(getLink(id))
      window.open(getLink(id))
    }
    return (
      <div className={sc('container')}>
        {diagnoseRes && diagnoseRes.desc ? (
          <div className='preview-wrap'>
            <h3>诊断报告概述</h3>
            <p>{diagnoseRes && diagnoseRes.desc || ''}</p>
            <h3>诊断目标建议</h3>
            <p>{diagnoseRes && diagnoseRes.recommend || ''}</p>
            <h3>特殊提醒</h3>
            <p>{diagnoseRes && diagnoseRes.remind || ''}</p>
            <h3>服务方案</h3>
            <p>{diagnoseRes && diagnoseRes.offerings || ''}</p>
            <a href={diagnoseRes.offeringsFilePath} target="_blank">{diagnoseRes.offeringsFileName}</a>
            <h3>推荐服务商</h3>
            <p>{diagnoseRes && diagnoseRes.relatedServerName && diagnoseRes.relatedServerName.join(',') || ''}</p>
            <h3>推荐技术经理人</h3>
            <p>{diagnoseRes && diagnoseRes.relatedTechManager && diagnoseRes.relatedTechManager.name || ''} {diagnoseRes && diagnoseRes.relatedTechManager && diagnoseRes.relatedTechManager.phone || ''}</p>
            <h3>推荐金融产品</h3>
            <div>
              {diagnoseRes.relatedFinancialProduct && diagnoseRes.relatedFinancialProduct.map((product: any) => {
                return (
                  <div className='banking-product-wrapper'>
                    <div>{product.name}</div>
                    <div>
                      <label>最高保障</label>
                      <p>{product.maxAmount/1000000}万</p>
                    </div>
                    <div>
                      <label>保险期限</label>
                      <p>{product.maxTerm}个月</p>
                    </div>
                    <div>
                      <label>最低费率</label>
                      <p>{product.minRate}</p>
                    </div>
                    <div><a onClick={() => {toProductDetail(product.id)}}>产品详情 ></a></div>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="empty-status">
            <Image src={icon1} width={160} />
            <p>暂无数据</p>
          </div>
        )}
        
      </div>
    );
  },
)
