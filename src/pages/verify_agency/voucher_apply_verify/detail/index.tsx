import { message } from 'antd';
import { history, useAccess } from 'umi';
import { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import scopedClasses from '@/utils/scopedClasses';
import './index.less';
import { getProgrammeVerifyDetail } from '@/services/service-programme-verify';
import VerifyInfoDetail from '@/components/verify_info_detail/verify-info-detail';

const sc = scopedClasses('user-config-kechuang');

export default () => {
  const [detail, setDetail] = useState<any>({});
  const { state = ''} = history.location.query as any;
  // 拿到当前角色的access权限兑现
  const access = useAccess()

  const prepare = async () => {
    const id = history.location.query?.id as string;
    if (id) {
      try {
        const res = await getProgrammeVerifyDetail(id);
        // getDictionary();
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

  const [checkState, setCheckState] = useState<boolean>(false)

  useEffect(() => {
    if (!state) return 
    if (state === 'PASSED' || state === 'REJECTED') {
      setCheckState(true)
    } else {
      setCheckState(false)
    }
  },[state])

  useEffect(() => {
    prepare();
  }, []);

  return (
    <PageContainer>
      <div className={sc('container')}>
        <div className={sc('container-title')}>企业基本信息</div>
        <div className={sc('container-desc')}>
          <span>企业名称：</span>
          <span>{detail?.name || '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>统一社会信用代码：</span>
          <span>{detail?.types?.map((e:any) => e.name).join('、') || '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>所属地市：</span>
          <span>{detail.areas?.map((e:any) => e.name).join('、') || '--'}</span>
        </div>
      </div>
      <div className={sc('container')}>
        <div className={sc('container-title')}>材料上传</div>
        <div className={sc('container-desc')}>
          <span>企业所属行业：</span>
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
        <div className={sc('container-desc')}>
          <span>企业上一年营收或上一年人数证明：</span>
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
      {
        (checkState || access['P_AT_FWFA']) &&
          <div style={{ background: '#fff', marginTop: 20, paddingTop: 20 }}>
            <VerifyInfoDetail auditId={detail?.auditId} reset={prepare} />
          </div>
      }
    </PageContainer>
  );
};
