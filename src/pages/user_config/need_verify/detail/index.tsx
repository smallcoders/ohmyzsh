import { message, Image } from 'antd';
import { history } from 'umi';
import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import scopedClasses from '@/utils/scopedClasses';
import './index.less';
import { getCreativeDetail } from '@/services/kc-verify';

const sc = scopedClasses('user-config-kechuang');

export default () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [detail, setDetail] = useState<any>({});

  const prepare = async () => {
    const id = history.location.query?.id as string;
    if (id) {
      try {
        const res = await getCreativeDetail(id);
        if (res.code === 0) {
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

  useEffect(() => {
    prepare();
  }, []);

  return (
    <PageContainer loading={loading}>
      <div className={sc('container')}>
        <div className={sc('container-title')}>科产需求信息</div>
        <div className={sc('container-desc')}>
          <div>
            <Image.PreviewGroup>
              {detail?.covers &&
                detail?.covers.map((p: string) => (
                  <Image key={p} height={200} width={300} src={p} />
                ))}
            </Image.PreviewGroup>
          </div>
        </div>
        <div className={sc('container-desc')}>
          <span>需求名称：</span>
          <span>{detail?.name || '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>需求类型：</span>
          <span>{detail?.patentType || '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>行业类别：</span>
          <span>{detail?.types ? detail?.types.join('，') : '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>需求区域：</span>
          <span>{detail?.patentCode || '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>需求时间范围：</span>
          <span>{detail?.patentEmpowerDate || '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>需求内容：</span>
          <div dangerouslySetInnerHTML={{ __html: detail?.introduction || '--' }} />
        </div>
        <div className={sc('container-desc')}>
          <span>企业信息：</span>
          <span>{detail?.transferType || '--'}</span>
        </div>
      </div>
    </PageContainer>
  );
};
