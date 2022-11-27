import { message, Image, Button } from 'antd';
import { history } from 'umi';
import { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import scopedClasses from '@/utils/scopedClasses';
import './index.less';
import { getDemandDetail } from '@/services/achievements-manage';
import { getEnumByName } from '@/services/common';

const sc = scopedClasses('science-technology-manage-achievements-detail');

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
        const res = await getDemandDetail(id);
        getDictionary();
        if (res.code === 0) {
          console.log(res);
          setDetail(res.result?.achievement);
        } else {
          throw new Error(res.message);
        }
      } catch (error) {
        message.error('服务器错误');
      } finally {
        setLoading(false);
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
    <PageContainer loading={loading}
      footer={[
        <Button onClick={() => history.push('/service-config/achievements-manage')}>返回</Button>,
      ]}
    >
      <div className={sc('container')}>
        <div className={sc('container-title')}>成果联系信息</div>
        <div className={sc('container-desc')}>
          <span>联系人：</span>
          <span>{detail?.contactName || '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>联系电话：</span>
          <span>{detail?.contactPhone || '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>企业名称：</span>
          <span>{detail?.enterpriseName || '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>所属区域：</span>
          <span>{detail?.areaName || '--'}</span>
        </div>
        <div className={sc('container-title')}>科技成果信息</div>
        <div className={sc('container-desc')}>
          <span>科技成果名称：</span>
          <span>{detail?.name || '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>成果年份：</span>
          <span>{detail?.achievementYear || '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>成果类别：</span>
          <span>{getEnum('CREATIVE_ACHIEVEMENT_CATEGORY_ENUM', detail?.category)}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>成果属性：</span>
          <span>{getEnum('CREATIVE_ACHIEVEMENT_ATTRIBUTE_ENUM', detail?.attribute)}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>成果成熟度：</span>
          <span>{getEnum('CREATIVE_MATURITY_ENUM', detail?.maturity)}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>所属技术领域：</span>
          <span>
            {getEnum('CREATIVE_ACHIEVEMENT_TECHNICAL_FIELD_ENUM', detail?.technicalField)}
          </span>
        </div>
        <div className={sc('container-desc')}>
          <span>主要应用行业：</span>
          <span>{detail?.types ? detail?.types.join('，') : '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>关键词：</span>
          <span>{detail?.keywordShow ? detail?.keywordShow.join(',') : '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>专利编号：</span>
          <span>{detail?.patentCode || '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>成果简介：</span>
          <div dangerouslySetInnerHTML={{ __html: detail?.introduction || '--' }} />
        </div>
        <div className={sc('container-desc')}>
          <span>成果转让方式：</span>
          <span>{getEnum('TRANSFER_TYPE_ENUM', detail?.transferType)}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>成果图片：</span>
          <div>
            <Image.PreviewGroup>
              {detail?.covers &&
                detail?.covers.map((p: any) => (
                  <Image key={p?.id} height={200} width={300} src={p?.path} />
                ))}
            </Image.PreviewGroup>
          </div>
        </div>
        <div className={sc('container-desc')}>
          <span>成果附件：</span>
          <span>
            {detail?.files &&
              detail?.files.map((p: any) => {
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
    </PageContainer>
  );
};
