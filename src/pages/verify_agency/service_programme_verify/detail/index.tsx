import { message, Image } from 'antd';
import { history, useLocation } from 'umi';
import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import scopedClasses from '@/utils/scopedClasses';
import './index.less';
import { getProgrammeVerifyDetail } from '@/services/service-programme-verify';
import { getEnumByName } from '@/services/common';
import VerifyInfoDetail from '@/components/verify_info_detail/verify-info-detail';

const sc = scopedClasses('user-config-kechuang');

export default () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [detail, setDetail] = useState<any>({});
  const [enums, setEnums] = useState<any>({});

  const getDictionary = async () => {
    try {
      const enumsRes = await Promise.all([
        getEnumByName('CREATIVE_ACHIEVEMENT_CATEGORY_ENUM'), // 成果类别
        getEnumByName('CREATIVE_ACHIEVEMENT_ATTRIBUTE_ENUM'), // 属性
        getEnumByName('CREATIVE_MATURITY_ENUM'), // 成熟度
        getEnumByName('CREATIVE_ACHIEVEMENT_TECHNICAL_FIELD_ENUM'), // 技术领域
        getEnumByName('TRANSFER_TYPE_ENUM'), // 技术转换
      ]);
      setEnums({
        CREATIVE_ACHIEVEMENT_CATEGORY_ENUM: enumsRes[0].result,
        CREATIVE_ACHIEVEMENT_ATTRIBUTE_ENUM: enumsRes[1].result,
        CREATIVE_MATURITY_ENUM: enumsRes[2].result,
        CREATIVE_ACHIEVEMENT_TECHNICAL_FIELD_ENUM: enumsRes[3].result,
        TRANSFER_TYPE_ENUM: enumsRes[4].result,
      });
    } catch (error) {
      message.error('服务器错误');
    }
  };

  const prepare = async () => {
    const id = history.location.query?.id as string;
    if (id) {
      try {
        const res = await getProgrammeVerifyDetail(id);
        getDictionary();
        if (res.code === 0) {
          console.log(res);
          setDetail(res.result);
        } else {
          throw new Error(res.message);
        }
      } catch (error) {
        message.error('服务器错误');
      } finally {
        // setLoading(false);
      }
    }
  };

  const getEnum = (enumType: string, enumName: string) => {
    try {
      return enums[enumType]?.filter((p: any) => p.enumName === enumName)[0].name;
    } catch (error) {
      return '--';
    }
  };

  useEffect(() => {
    prepare();
  }, []);

  return (
    <PageContainer>
      <div className={sc('container')}>
        <div className={sc('container-title')}>服务方案信息</div>
        <div className={sc('container-desc')}>
          <div className='cover-img'>
            <Image.PreviewGroup>
              {detail.coverUrl ? <Image height={200} width={300} src={detail.coverUrl} /> : ''}
            </Image.PreviewGroup>
          </div>
        </div>
        <div className={sc('container-desc')}>
          <span>方案名称：</span>
          <span>{detail?.name || '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>方案类型：</span>
          <span>{detail?.types?.map((e:any) => e.name).join('、') || '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>方案服务区域：</span>
          <span>{detail.areas?.map((e:any) => e.name).join('、') || '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>服务行业：</span>
          <span>{detail?.industryName || '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>方案内容：</span>
          <div dangerouslySetInnerHTML={{ __html: detail?.content || '--' }} />
        </div>
        <div className={sc('container-desc')}>
          <span>相关附件：</span>
          <span>
            {detail?.attachments &&
              detail?.attachments.map((p: any) => {
                return (
                  <>
                    <a target="_blank" rel="noreferrer" style={{ marginRight: 20 }} href={p.path}>
                      {p.name}.{p.format}
                    </a>
                  </>
                );
              })}
          </span>
        </div>
      </div>
      <div className={sc('container')}>
        <div className={sc('container-title')}>服务商信息</div>
        <div className={sc('container-desc')}>
          <span>服务商名称：</span>
          <span>{detail?.providerName || '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>服务商所在地：</span>
          <span>{detail?.providerAreaCode}</span>
        </div>
      </div>
      <div className={sc('container')}>
        <div className={sc('container-title')}>联系信息</div>
        <div className={sc('container-desc')}>
          <span>联系人：</span>
          <span>{detail?.contactName || '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>联系电话：</span>
          <span>{detail?.phone}</span>
        </div>
      </div>
      <div className={sc('container')}>
        <div className={sc('container-title')}>其他信息</div>
        <div className={sc('container-desc')}>
          <span>是否参加2022安徽省工业互联网巡回大讲堂供需对接会：</span>
          <span>{detail?.joined? '是' : '否'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>意向地：</span>
          <span>{detail?.intendAreaName || '--'}</span>
        </div>
      </div>
      <div style={{ background: '#fff', marginTop: 20, paddingTop: 20 }}>
        <VerifyInfoDetail auditId={detail?.auditId} reset={prepare} />
      </div>
    </PageContainer>
  );
};
