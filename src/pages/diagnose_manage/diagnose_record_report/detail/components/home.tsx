/* eslint-disable */
import '../service-config-diagnose-manage.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useEffect, useState } from 'react';
import DiagnoseManage from '@/types/service-config-diagnose-manage';
type DiagnoseResult = DiagnoseManage.Diagnose;

const sc = scopedClasses('service-config-diagnose-manage');


const TableList: React.FC = () => {
  const [resultObj, setResultObj] = useState<DiagnoseResult>({})

  const previewResult = async () => {
		setResultObj({
      "name": "111",
      "summary": "111",
      "recommendations": "建议",
      "remind": "2223夫人全国v",
      "defaultDiagnoseResult": false,
      "relatedServers": ['1号服务商', '2号服务商'],
      "relatedTechnicalManager": {
        "name": "jingqin5",
        "phone": "18326676793"
      },
      "offerings": "555",
      "offeringsFile": "1666085316000001",
      "offeringsFileName": "办公室入住指引.pdf",
      "offeringsFilePath": "https://oss.lingyangplat.com/iiep-dev/d7d37ce13c024a9cbfcce4b6c5ab4594.pdf"
    })
	}
  useEffect(() => {
    previewResult()
  },[])


  return (
    <div className={sc('container')}>
      <div className='preview-wrap'>
					<h3>诊断报告概述</h3>
					<p>{resultObj && resultObj.summary || ''}</p>
					<h3>诊断目标建议</h3>
					<p>{resultObj && resultObj.recommendations || ''}</p>
					<h3>特殊提醒</h3>
					<p>{resultObj && resultObj.remind || ''}</p>
					<h3>服务方案</h3>
					<p>{resultObj && resultObj.offerings || ''}</p>
					<a href={resultObj.offeringsFilePath} target="_blank">{resultObj.offeringsFileName}</a>
					<h3>推荐服务商</h3>
					<p>{resultObj&&resultObj.relatedServers&&resultObj.relatedServers.join(',') || ''}</p>
					<h3>推荐技术经理人</h3>
					<p>{resultObj && resultObj.relatedTechnicalManager && resultObj.relatedTechnicalManager.name || ''} {resultObj && resultObj.relatedTechnicalManager && resultObj.relatedTechnicalManager.phone || ''}</p>
					<h3>推荐金融产品</h3>
          <div className='banking-product-wrapper'>
            <div>雇主责任险</div>
            <div>
              <label>最高保障</label>
              <p>100万</p>
            </div>
            <div>
              <label>保险期限</label>
              <p>12个月</p>
            </div>
            <div>
              <label>最低费率</label>
              <p>根据工种</p>
            </div>
            <div><a>产品详情 ></a></div>
          </div>
				</div>
    </div>
  );
};

export default TableList;
