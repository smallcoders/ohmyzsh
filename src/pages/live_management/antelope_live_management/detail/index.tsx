import { message, Image } from 'antd';
import { history } from 'umi';
import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import scopedClasses from '@/utils/scopedClasses';
import './index.less';
import { getCreativeDetail } from '@/services/kc-verify';
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
        const res = await getCreativeDetail(id);
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
    <PageContainer loading={loading}>
      <div className={sc('container')}>
        {/* <div className={sc('container-title')}>技术成果信息</div> */}
        <div className={sc('container-desc')}>
          <span>直播名称：</span>
          <span>{detail?.name || '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>状态：</span>
          <span>{detail?.achievementYear || '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>封面：</span>
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
          <span>类型：</span>
          <span>{getEnum('CREATIVE_ACHIEVEMENT_CATEGORY_ENUM', detail?.category)}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>主讲人：</span>
          <span>{getEnum('CREATIVE_ACHIEVEMENT_ATTRIBUTE_ENUM', detail?.attribute)}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>开始时间：</span>
          <span>{getEnum('CREATIVE_MATURITY_ENUM', detail?.maturity)}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>结束时间：</span>
          <span>
            {getEnum('CREATIVE_ACHIEVEMENT_TECHNICAL_FIELD_ENUM', detail?.technicalField)}
          </span>
        </div>
        <div className={sc('container-desc')}>
          <span>URL：</span>
          <span>{detail?.types ? detail?.types.join('，') : '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>内容概况：</span>
          <span>{detail?.patentCode || '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>点击量：</span>
          <div dangerouslySetInnerHTML={{ __html: detail?.introduction || '--' }} />
        </div>
        <div className={sc('container-desc')}>
          <span>上次上架人：</span>
          <span>{getEnum('TRANSFER_TYPE_ENUM', detail?.transferType)}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>上次上架时间：</span>
          <span>{detail?.proxy ? '是' : '否'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>创建人：</span>
          <span>
            {detail?.contactName || '--'}
            {detail?.contactNameHide ? '（匿名）' : ''}
          </span>
        </div>
        <div className={sc('container-desc')}>
          <span>创建时间：</span>
          <span>
            {detail?.contactPhone || '--'}
            {detail?.contactPhoneHide ? '（隐藏）' : ''}
          </span>
        </div>
      </div>
    </PageContainer>
  );
};
