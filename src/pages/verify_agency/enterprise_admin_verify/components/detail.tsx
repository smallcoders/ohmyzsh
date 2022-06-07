import { message, Image, Drawer } from 'antd';

import React, { useState, useEffect } from 'react';

import scopedClasses from '@/utils/scopedClasses';
import './index.less';
import { getCreativeDetail } from '@/services/kc-verify';

import VerifyInfoDetail from './verify_info_detail/verify-info-detail';

const sc = scopedClasses('user-config-kechuang');

export default (props: any) => {
  const { id, visible, setVisible } = props;
  const [detail, setDetail] = useState<any>({});
  const [enums, setEnums] = useState<any>({});

  // const getDictionary = async () => {
  //   try {
  //     const enumsRes = await Promise.all([
  //       getEnumByName('CREATIVE_ACHIEVEMENT_CATEGORY_ENUM'), // 成果类别
  //       getEnumByName('CREATIVE_ACHIEVEMENT_ATTRIBUTE_ENUM'), // 属性
  //       getEnumByName('CREATIVE_MATURITY_ENUM'), // 成熟度
  //       getEnumByName('CREATIVE_ACHIEVEMENT_TECHNICAL_FIELD_ENUM'), // 技术领域
  //       getEnumByName('TRANSFER_TYPE_ENUM'), // 技术转换
  //     ]);
  //     setEnums({
  //       CREATIVE_ACHIEVEMENT_CATEGORY_ENUM: enumsRes[0].result,
  //       CREATIVE_ACHIEVEMENT_ATTRIBUTE_ENUM: enumsRes[1].result,
  //       CREATIVE_MATURITY_ENUM: enumsRes[2].result,
  //       CREATIVE_ACHIEVEMENT_TECHNICAL_FIELD_ENUM: enumsRes[3].result,
  //       TRANSFER_TYPE_ENUM: enumsRes[4].result,
  //     });
  //   } catch (error) {
  //     message.error('服务器错误');
  //   }
  // };

  const prepare = async () => {
    if (id) {
      try {
        const res = await getCreativeDetail(id);
        if (res.code === 0) {
          console.log(res);
          setDetail(res.result);
        } else {
          throw new Error(res.message);
        }
      } catch (error) {
        message.error('服务器错误');
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
  }, [id]);

  return (
    <Drawer title="详情" placement="right" visible={visible}>
      <div className={sc('container')}>
        <div className={sc('container-title')}>申请信息</div>
        <div className={sc('container-desc')}>
          <span>申请人姓名：</span>
          <span>{detail?.name || '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>手机号：</span>
          <span>{detail?.achievementYear || '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>组织类型：</span>
          <span>{getEnum('CREATIVE_ACHIEVEMENT_CATEGORY_ENUM', detail?.category)}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>组织名称：</span>
          <span>{getEnum('CREATIVE_ACHIEVEMENT_ATTRIBUTE_ENUM', detail?.attribute)}</span>
        </div>
        <>
          <div className={sc('container-desc')}>
            <span>法人姓名：</span>
            <span>{getEnum('CREATIVE_MATURITY_ENUM', detail?.maturity)}</span>
          </div>
          <div className={sc('container-desc')}>
            <span>法人身份证号：</span>
            <span>
              {getEnum('CREATIVE_ACHIEVEMENT_TECHNICAL_FIELD_ENUM', detail?.technicalField)}
            </span>
          </div>
        </>
        <div className={sc('container-desc')}>
          <span>企业注册区域：</span>
          <span>{detail?.types ? detail?.types.join('，') : '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>企业营业执照：</span>
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
          <span>认证公函：</span>
          <div>
            <Image.PreviewGroup>
              {detail?.covers &&
                detail?.covers.map((p: any) => (
                  <Image key={p?.id} height={200} width={300} src={p?.path} />
                ))}
            </Image.PreviewGroup>
          </div>
        </div>
      </div>
      <div style={{ background: '#fff', marginTop: 20, paddingTop: 20 }}>
        <VerifyInfoDetail auditId={detail?.auditId} reset={prepare} />
      </div>
    </Drawer>
  );
};
