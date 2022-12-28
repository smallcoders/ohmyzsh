import { PageContainer } from '@ant-design/pro-layout';
import scopedClasses from '@/utils/scopedClasses';
import { history } from 'umi';
import { Button, message } from 'antd';
import { getProductInfo, queryPurpose } from '@/services/banking-product';
import { useEffect, useState } from 'react';
import { IsCirculationLoanMap, guaranteeMethodMap, ObjectMap } from '../constants';
import '@/components/FormEdit/index.less';
import './index.less';
const sc = scopedClasses('product-detail-info');
export default () => {
  const { id } = history.location.query as any;
  const [detail, setDetail] = useState<any>(0);
  const [purpose, setPurpose] = useState<any>([]);
  const getData = async () => {
    try {
      const data = await Promise.all([queryPurpose()]);
      setPurpose(data?.[0]?.result || []);
    } catch (error) {
      message.error('数据初始化错误');
    }
  };
  useEffect(() => {
    getData();
    getProductInfo({ id }).then((res) => {
      if (res.code === 0) {
        setDetail(res.result);
      } else {
        message.error('产品信息获取失败');
      }
    });
  }, []);
  return (
    <PageContainer
      className={sc('pages')}
      ghost
      footer={[
        <Button size="large" onClick={() => history.goBack()}>
          返回
        </Button>,
      ]}
    >
      <div className={sc('page')}>
        <div className={sc('page-item')}>
          <div className={sc('page-item-title')}>基本信息</div>
          <div className={sc('page-item-body')}>
            <div className={sc('page-item-body-item')}>
              <div className={sc('page-item-body-item-label')}>产品名称：</div>
              <div className={sc('page-item-body-item-wrap')}>{detail.name || '--'}</div>
            </div>
            <div className={sc('page-item-body-item')}>
              <div className={sc('page-item-body-item-label')}>产品类型：</div>
              <div className={sc('page-item-body-item-wrap')}>{detail.typeName || '--'}</div>
            </div>
            <div className={sc('page-item-body-item')}>
              <div className={sc('page-item-body-item-label')}>金融机构：</div>
              <div className={sc('page-item-body-item-wrap')}>{detail.bankName || '--'}</div>
            </div>
            <div className={sc('page-item-body-item')}>
              <div className={sc('page-item-body-item-label')}>担保方式：</div>
              <div className={sc('page-item-body-item-wrap')}>
                {guaranteeMethodMap[detail.warrantType] || '--'}
              </div>
            </div>
            <div className={sc('page-item-body-item')}>
              <div className={sc('page-item-body-item-label')}>面向对象：</div>
              <div className={sc('page-item-body-item-wrap')}>
                {ObjectMap[detail.object] || '--'}
              </div>
            </div>
            {!detail?.typeName?.includes('保险') && (
              <div className={sc('page-item-body-item')}>
                <div className={sc('page-item-body-item-label')}>支持循环贷：</div>
                <div className={sc('page-item-body-item-wrap')}>
                  {IsCirculationLoanMap[detail.isCirculationLoan] || '--'}
                </div>
              </div>
            )}

            <div className={sc('page-item-body-item')}>
              <div className={sc('page-item-body-item-label')}>开放地区：</div>
              <div className={sc('page-item-body-item-wrap')}>{detail.openArea || '--'}</div>
            </div>
            {!detail?.typeName?.includes('保险') && (
              <div className={sc('page-item-body-item')}>
                <div className={sc('page-item-body-item-label')}>贷款用途：</div>
                <div className={sc('page-item-body-item-wrap')}>
                  {(detail.loanIds &&
                    purpose
                      ?.filter((it: any) => detail.loanIds.split(',')?.includes(it.id.toString()))
                      .map((it: any) => it.name)
                      .join(',')) ||
                    '--'}
                </div>
              </div>
            )}
            <div className={sc('page-item-body-item')}>
              <div className={sc('page-item-body-item-label')}>产品简介：</div>
              <div
                className="ck ck-content"
                dangerouslySetInnerHTML={{ __html: detail.content || '--' }}
              />
            </div>
            <div className={sc('page-item-body-item')}>
              <div className={sc('page-item-body-item-label')}>产品特点：</div>
              <div
                className="ck ck-content"
                dangerouslySetInnerHTML={{ __html: detail.productFeature || '--' }}
              />
            </div>
            <div className={sc('page-item-body-item')}>
              <div className={sc('page-item-body-item-label')}>申请条件：</div>
              <div
                className="ck ck-content"
                dangerouslySetInnerHTML={{ __html: detail.applyCondition || '--' }}
              />
            </div>
            <div className={sc('page-item-body-item')}>
              <div className={sc('page-item-body-item-label')}>申请流程：</div>
              <div className={sc('page-item-body-item-wrap') + ' productProcessInfoList'}>
                {detail.productProcessInfoList?.map((item: any, index: number) => {
                  return (
                    <div key={index} className="productProcessInfoList-item">
                      {index ? <div className="line" /> : null}
                      <div className="circle">{item.step}</div>
                      <div className="name">{item.name}</div>
                    </div>
                  );
                }) || '--'}
              </div>
            </div>
          </div>
        </div>
        <div className={sc('page-item')}>
          <div className={sc('page-item-title')}>额度/利率信息</div>
          <div className={sc('page-item-body')}>
            <div className={sc('page-item-body-item')}>
              <div className={sc('page-item-body-item-label')}>
                {detail?.typeName?.includes('保险') ? '保险' : ''}额度：
              </div>
              <div className={sc('page-item-body-item-wrap')}>
                {
                  typeof detail.minAmount === 'number' ? `${detail.minAmount / 1000000}万元` : '--'
                }
                -
                {
                  typeof detail.maxAmount === 'number' ? `${detail.maxAmount / 1000000}万元` : '--'
                }
              </div>
            </div>
            <div className={sc('page-item-body-item')}>
              <div className={sc('page-item-body-item-label')}>
                {detail?.typeName?.includes('保险') ? '保险' : ''}额度文案：
              </div>
              <div className={sc('page-item-body-item-wrap')}>{detail.amountDesc || '--'}</div>
            </div>
            <div className={sc('page-item-body-item')}>
              <div className={sc('page-item-body-item-label')}>
                {detail?.typeName?.includes('保险') ? '费率' : '年化利率'}：
              </div>
              <div className={sc('page-item-body-item-wrap')}>
                {detail.minRate}% - {detail.maxRate}%
              </div>
            </div>
            <div className={sc('page-item-body-item')}>
              <div className={sc('page-item-body-item-label')}>
                {detail?.typeName?.includes('保险') ? '费率' : '年化利率'}文案：
              </div>
              <div className={sc('page-item-body-item-wrap')}>{detail.rateDesc || '--'}</div>
            </div>
            <div className={sc('page-item-body-item')}>
              <div className={sc('page-item-body-item-label')}>期限：</div>
              <div className={sc('page-item-body-item-wrap')}>
                {detail.minTerm}个月 - {detail.maxTerm}个月
              </div>
            </div>
            <div className={sc('page-item-body-item')}>
              <div className={sc('page-item-body-item-label')}>期限文案：</div>
              <div className={sc('page-item-body-item-wrap')}>{detail.termDesc || '--'}</div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
