import { message, Image, Button } from 'antd';
import { history } from 'umi';
import { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import scopedClasses from '@/utils/scopedClasses';
import './index.less';
import { getDemandDetail } from '@/services/creative-demand';

const sc = scopedClasses('service-config-creative-detail');

export default () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [detail, setDetail] = useState<any>({});

  const prepare = async () => {
    const id = history.location.query?.id as string;
    if (id) {
      try {
        const res = await getDemandDetail(id);
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
    <PageContainer loading={loading}
      footer={[
        <Button onClick={() => history.goBack()}>返回</Button>,
      ]}
    >
      <div className={sc('container')}>
        <div className={sc('container-title')}>创新需求信息</div>
        <div style={{ marginLeft: 200 }}>
          <Image height={200} width={300} src={detail?.cover} />
        </div>
        <div className={sc('container-desc')}>
          <span>需求名称：</span>
          <span>{detail?.name || '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>需求类型：</span>
          <span>{detail?.typeName || '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>行业类别：</span>
          <span>{detail?.industryTypeNames ? detail?.industryTypeNames.join('，') : '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>关键词：</span>
          <span>{detail?.typeName || '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>需求区域：</span>
          <span>{detail?.areaNames ? detail?.areaNames.join('，') : '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>需求时间范围：</span>
          <span>{detail?.startDate ? `${detail?.startDate}~${detail?.endDate}` : '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>需求内容：</span>
          <span>{detail?.content || '--'}</span>
        </div>
        <div className={sc('container-title')}>企业联系信息</div>
        <div className={sc('container-desc')}>
          <span>企业信息展示：</span>
          <span>{detail?.hide ? '隐藏' : '公开'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>联系人：</span>
          <span>{detail?.contactName || '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>联系电话：</span>
          <span>{detail?.contactPhone || '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>需求企业名称：</span>
          <span>{detail?.orgName || '--'}</span>
        </div>
      </div>
    </PageContainer>
  );
};
