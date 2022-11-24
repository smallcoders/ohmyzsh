import { message, Image } from 'antd';
import { history, useAccess } from 'umi';
import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import scopedClasses from '@/utils/scopedClasses';
import './index.less';
import { getOfficeRequirementVerifyDetail } from '@/services/office-requirement-verify';
import { getEnumByName } from '@/services/common';
import VerifyInfoDetail from '@/components/verify_info_detail/verify-info-detail';

const sc = scopedClasses('user-config-kechuang');

export default () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [detail, setDetail] = useState<any>({});
  const [enums, setEnums] = useState<any>({});
  // 拿到当前角色的access权限兑现
  const access = useAccess()
  const { state = '' } = history.location.query as any;

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
        const res = await getOfficeRequirementVerifyDetail(id);
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

  const [checkState, setCheckState] = useState<boolean>(false)

  useEffect(() => {
    if (!state) return
    if (state === 'AUDIT_PASSED' || state === 'AUDIT_REJECTED') {
      setCheckState(true)
    } else {
      setCheckState(false)
    }
  },[state]);

  useEffect(() => {
    prepare();
  }, []);

  return (
    <PageContainer>
      <div className={sc('container')}>
        <div className={sc('container-title')}>企业需求信息</div>
        <div className={sc('container-desc')}>
          <div className='cover-img'>
            <Image.PreviewGroup>
              {detail.coverUrl ? <Image height={200} width={300} src={detail.coverUrl} /> : ''}
            </Image.PreviewGroup>
          </div>
        </div>
        <div className={sc('container-desc')}>
          <span>需求名称：</span>
          <span>{detail?.name || '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>需求类型：</span>
          <span>{detail?.typeNames?.join('、') || '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>需求区域：</span>
          <span>{detail.areaNames?.join('、') || '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>需求时间范围：</span>
          <span>{detail?.startDate + '至' + detail?.endDate  || '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>需求内容：</span>
          <div dangerouslySetInnerHTML={{ __html: detail?.content || '--' }} />
        </div>
      </div>
      <div className={sc('container')}>
        <div className={sc('container-title')}>企业基础信息</div>
        <div className={sc('container-desc')}>
          <span>组织信息展示：</span>
          <span>{detail?.hide ? '隐藏' : '公开'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>企业名称：</span>
          <span>{detail?.orgName || '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>企业所在地：</span>
          <span>{detail?.orgAreaName}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>所属产业：</span>
          <span>{detail?.orgIndustryName || '--'}</span>
        </div>
      </div>
      <div className={sc('container')}>
        <div className={sc('container-title')}>更多信息</div>
        <div className={sc('container-desc')}>
          <span>企业规模：</span>
          <span>{detail?.orgScaleName || '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>企业痛点：</span>
          <span>{detail?.orgDifficultyList?.map((e:any) => e.name).join('、') || '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>在用信息系统：</span>
          <span>{detail?.orgUsingSystemList?.map((e:any) => e.name).join('、') || '--'}</span>
        </div>
      </div>
      <div className={sc('container')}>
        <div className={sc('container-title')}>联系信息</div>
        <div className={sc('container-desc')}>
          <span>联系人：</span>
          <span>{detail?.contact || '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>联系电话：</span>
          <span>{detail?.phone}</span>
        </div>
      </div>
      {
        (checkState || access['P_AT_QYXQ']) && 
        <div style={{ background: '#fff', marginTop: 20, paddingTop: 20 }}>
          <VerifyInfoDetail auditId={detail?.auditId} reset={prepare} />
        </div>
      }
    </PageContainer>
  );
};
