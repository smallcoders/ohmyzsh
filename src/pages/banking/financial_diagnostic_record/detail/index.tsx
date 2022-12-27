import { PageContainer } from '@ant-design/pro-layout';
import scopedClasses from '@/utils/scopedClasses';
import { Button, message, Table, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import { routeName } from '@/../config/routes';
import { useHistory } from 'react-router-dom';
import { queryDiagnoseDetail } from '@/services/financial-diagnostic-record';
import type DiagnosticRecord from '@/types/financial-diagnostic-record';
import './index.less';
const sc = scopedClasses('diagnostic-record-detail');
export default () => {
  const history = useHistory();
  const { id } = history.location?.query as any;
  const [basicInfo, setBasicInfo] = useState<DiagnosticRecord.CustomerInfo>({});
  const [recordResult1, setRecordResult1] = useState<DiagnosticRecord.DiagnoseRecord>({});
  const [recordResult2, setRecordResult2] = useState<DiagnosticRecord.OrgAssets[]>([]);
  const [applyInfo, setApplyInfo] = useState<DiagnosticRecord.DiagnoseCreditVO[]>([]);
  const getDiagnoseDetailInfo = async () => {
    try {
      const { code, result } = await queryDiagnoseDetail(id);
      if (code === 0) {
        const { customerInfo, diagnoseRecord, orgAssets, diagnoseCreditVO } = result;
        setBasicInfo(customerInfo);
        setRecordResult1(diagnoseRecord);
        setRecordResult2(orgAssets);
        setApplyInfo(diagnoseCreditVO);
      } else {
        message.error('诊断详情获取失败');
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getDiagnoseDetailInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const column1 = [
    {
      title: '资产类型',
      dataIndex: 'typeContent',
      key: 'typeContent',
      width: 240,
    },
    {
      title: '购置成本(万元)',
      dataIndex: 'cost',
      key: 'cost',
      width: 240,
      render: (cost: number) => {
        return cost ? (cost / 1000000).toFixed(2) : '--';
      },
    },
    {
      title: '购置时间',
      dataIndex: 'buyTime',
      key: 'buyTime',
      width: 240,
    },
    {
      title: '贷款是否结清',
      dataIndex: 'clear',
      key: 'clear',
      width: 240,
      render: (clear: boolean) => {
        return clear ? '已结清' : '未结清';
      },
    },
  ];
  const column2 = [
    {
      title: '业务申请编号',
      dataIndex: 'id',
      key: 'id',
      width: 240,
    },
    {
      title: '产品名称',
      dataIndex: 'productName',
      key: 'productName',
      width: 240,
    },
  ];
  const quality = [
    { value: '1', name: '规上企业' },
    { value: '2', name: ' 高新技术企业 ' },
    { value: '3', name: '科技型中小企业' },
    { value: '4', name: '民营科技企业' },
    { value: '5', name: ' 专精特新企业' },
  ];
  return (
    <PageContainer
      className={sc('pages')}
      ghost
      footer={[
        // eslint-disable-next-line react/jsx-key
        <Button size="large" onClick={() => history.goBack()}>
          返回
        </Button>,
      ]}
    >
      <div className={sc('page')}>
        <div className={sc('page-item')}>
          <div className={sc('page-item-title')}>企业基本信息</div>
          <div className={sc('page-item-body')}>
            <div className={sc('page-item-body-item')}>
              <div className={sc('page-item-body-item-label')}>业务名称：</div>
              <div className={sc('page-item-body-item-wrap')}>{basicInfo?.name || '--'}</div>
            </div>
            <div className={sc('page-item-body-item')}>
              <div className={sc('page-item-body-item-label')}>法定代表人：</div>
              <div className={sc('page-item-body-item-wrap')}>
                {basicInfo?.legalPersonName || '--'}
              </div>
            </div>
            <div className={sc('page-item-body-item')}>
              <div className={sc('page-item-body-item-label')}>注册地址：</div>
              <div className={sc('page-item-body-item-wrap')}>{basicInfo?.regAddress || '--'}</div>
            </div>
            <div className={sc('page-item-body-item')}>
              <div className={sc('page-item-body-item-label')}>成立日期：</div>
              <div className={sc('page-item-body-item-wrap')}>
                {basicInfo?.formedDate ? basicInfo.formedDate.split(' ')[0] : '--'}
              </div>
            </div>
            <div className={sc('page-item-body-item')}>
              <div className={sc('page-item-body-item-label')}>联系人：</div>
              <div className={sc('page-item-body-item-wrap')}>{basicInfo?.contacts || '--'}</div>
            </div>
            <div className={sc('page-item-body-item')}>
              <div className={sc('page-item-body-item-label')}>联系方式：</div>
              <div className={sc('page-item-body-item-wrap')}>{basicInfo?.phone || '--'}</div>
            </div>
          </div>
        </div>
        {/* 金融诊断结果 */}
        <div className={sc('page-item')}>
          <div className={sc('page-item-title')}>金融诊断结果</div>
          <div className={sc('page-item-body')}>
            <div className={sc('page-item-body-item')}>
              <div className={sc('page-item-body-item-label')}>金融诊断编号：</div>
              <div className={sc('page-item-body-item-wrap')}>
                {recordResult1?.diagnoseNum || '--'}
              </div>
            </div>
            <div className={sc('page-item-body-item')}>
              <div className={sc('page-item-body-item-label')}>金融诊断时间：</div>
              <div className={sc('page-item-body-item-wrap')}>
                {recordResult1?.createTime || '--'}
              </div>
            </div>
            <div className={sc('page-item-body-item')}>
              <div className={sc('page-item-body-item-label')}>拟融资金额：</div>
              <div className={sc('page-item-body-item-wrap')}>
                {recordResult1?.amount
                  ? (recordResult1?.amount / 1000000).toFixed(2) + '万元'
                  : '--'}
              </div>
            </div>
            <div className={sc('page-item-body-item')}>
              <div className={sc('page-item-body-item-label')}>拟融资期限：</div>
              <div className={sc('page-item-body-item-wrap')}>
                {recordResult1?.term ? recordResult1.term + '个月' : '--'}
              </div>
            </div>
            <div className={sc('page-item-body-item')}>
              <div className={sc('page-item-body-item-label')}>融资用途：</div>
              <div className={sc('page-item-body-item-wrap')}>
                {recordResult1?.purpose > 100000000
                  ? recordResult1.purposeContent + ' - ' + recordResult1.purposeRemark
                  : recordResult1.purposeContent}
              </div>
            </div>
            <div className={sc('page-item-body-item')}>
              <div className={sc('page-item-body-item-label')}>企业上一年营收规模：</div>
              <div className={sc('page-item-body-item-wrap')}>
                {recordResult1?.revenueContent || '--'}
              </div>
            </div>
            <div className={sc('page-item-body-item')}>
              <div className={sc('page-item-body-item-label')}>企业资质：</div>
              <div className={sc('page-item-body-item-wrap')}>
                {recordResult1?.qualification
                  ? recordResult1.qualification.split(',').map((item) => {
                      return (
                        <Tag key={item} color="default">
                          {quality[Number(item) - 1].name}
                        </Tag>
                      );
                    })
                  : '--'}
              </div>
            </div>
            <div className={sc('page-item-body-item')}>
              <div className={sc('page-item-body-item-label')}>企业资产信息：</div>
            </div>
            <div className={sc('page-item-body-item')}>
              <div className={sc('page-item-body-item-table')}>
                <Table dataSource={recordResult2} columns={column1} pagination={false} />
              </div>
            </div>
          </div>
        </div>
        <div className={sc('page-item')}>
          <div className={sc('page-item-title')}>产品申请信息</div>
          <div className={sc('page-item-body')}>
            <div className={sc('page-item-body-item')}>
              <div className={sc('page-item-body-item-label')}>产品申请数量：</div>
              <div className={sc('page-item-body-item-wrap')}>{recordResult1?.applyNum}</div>
            </div>
            {recordResult1?.applyNum === 0 ? (
              <></>
            ) : (
              <div className={sc('page-item-body-item')}>
                <div className={sc('page-item-body-item-table')}>
                  <Table dataSource={applyInfo} columns={column2} pagination={false} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
