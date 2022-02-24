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

  useEffect(() => {
    prepare();
  }, []);

  return (
    <PageContainer loading={loading}>
      <div className={sc('container')}>
        <div className={sc('container-title')}>创新技术信息</div>
        <div className={sc('container-desc')}>
          <span>创新技术名称：</span>
          <span>{detail?.name || '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>行业类别：</span>
          <span>{detail?.types ? detail?.types.join('，') : '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>是否专利：</span>
          <span>{detail?.patent ? '是' : '否'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>专利类型：</span>
          <span>{detail?.patentType || '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>专利号/申请号：</span>
          <span>{detail?.patentCode || '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>专利授权日期：</span>
          <span>{detail?.patentEmpowerDate || '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>技术简介：</span>
          <span>{detail?.introduction || '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>技术转让方式：</span>
          <span>{detail?.transferType || '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>技术成熟度：</span>
          <span>{detail?.maturity || '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>技术图片：</span>
          <div>
            <Image.PreviewGroup>
              {detail?.covers &&
                detail?.covers.map((p: string) => <Image key={p} width={200} src={p} />)}
            </Image.PreviewGroup>
          </div>
        </div>
        <div className={sc('container-desc')}>
          <span>证明材料：</span>
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
        <div className={sc('container-desc')}>
          <span>是否选择平台技术经理人代理：</span>
          <span>{detail?.proxy ? '是' : '否'}</span>
        </div>

        <div className={sc('container-title')}>发布人信息</div>
        <div className={sc('container-desc')}>
          <span>发布人：</span>
          <span>{detail?.publisherName || '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>手机号码：</span>
          <span>{detail?.phone || '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>单位：</span>
          <span>{detail?.workUnit || '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>所属区域：</span>
          <span>{detail?.areaName || '--'}</span>
        </div>
      </div>
    </PageContainer>
  );
};
