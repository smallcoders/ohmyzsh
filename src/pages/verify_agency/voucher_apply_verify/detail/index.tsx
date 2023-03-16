import { message, Form, Button } from 'antd';
import { history, useAccess } from 'umi';
import { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import scopedClasses from '@/utils/scopedClasses';
import './index.less';
import { getVoucherVerifyDetail, auditVoucherVerify } from '@/services/service-programme-verify';
import VerifyStepsDetail from '@/components/verify_steps';
import { routeName } from '@/../config/routes';
import CommonTitle from '@/components/verify_steps/common_title';
import VerifyDescription from '@/components/verify_steps/verify_description/verify-description';

const sc = scopedClasses('user-config-kechuang');
export const VerifyListText = {
  1: '审核通过',
  0: '审核拒绝',
  2: '审核提交',
  3: '撤回申领'
};

export default () => {
  const [detail, setDetail] = useState<any>({});
  const [list, setList] = useState<any>([]);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const { state = ''} = history.location.query as any;
  // 拿到当前角色的access权限兑现
  const access = useAccess()

  const hanldeGetAuditDetail = async () => {
    const id = history.location.query?.id as string;
    if (id) {
      try {
        const res = await getVoucherVerifyDetail(id);
        if (res.code === 0) {
          setDetail(res.result);
          const { auditList } = res.result
          let arr:any = []
          if(state == 0) {
            arr = [
              {
                opName: '平台审核',
                showVerifyForm: true
              },
              ...auditList
            ]
          }else {
            arr = [...auditList]
          }
          setList(
            arr.map(
              (item: {
                opName: string;
                auditResult: number;
                createTime: string | undefined;
                auditContent: string | undefined;
                showVerifyForm?: boolean;
              }) => {
                return {
                  title: (
                    <CommonTitle
                      title={item.opName}
                      detail={VerifyListText[item.auditResult] || ''}
                      time={item.createTime}
                      special={
                        item.auditResult === 1 ||
                        item.auditResult === 0
                      }
                      reason={item.auditContent}
                      color={item.auditResult === 0 ? '#FF65B3' : ''}
                    />
                  ),
                  description: 
                    item.showVerifyForm ? (
                      <VerifyDescription form={form} />
                    ) : null,
                  state: item.auditResult,
                };
              },
            ),
          );
        } else {
          throw new Error(res.message);
        }
      } catch (error) {
        message.error('服务器错误');
      } finally {
      }
    }
  }

  const prepare = async () => {
    hanldeGetAuditDetail()
  };

  const [checkState, setCheckState] = useState<boolean>(false)

  useEffect(() => {
    if (!state) return 
    if (state === '1' || state === '2') {
      setCheckState(true)
    } else {
      setCheckState(false)
    }
  },[state])

  useEffect(() => {
    prepare();
  }, []);

  const refresh = () => {
    hanldeGetAuditDetail();
  };

  const onBack = () => {
    history.push(`${routeName.VOUCHER_APPLY_VERIFY}`);
  };

  // 提交
  const onSave = async () => {
    form
      .validateFields()
      .then(async (value) => {
        const { result, reason} = value
        setLoading(true);
        const tooltipMessage = '提交';
        const submitRes = await auditVoucherVerify({
          applyId: history.location.query?.id,
          auditResult: result ? 1 : 0,
          auditContent: reason
        });
        if (submitRes.code === 0) {
          message.success(`${tooltipMessage}成功`);
          form.resetFields();
          refresh();
          onBack();
        } else {
          message.error(`${tooltipMessage}失败，原因:{${submitRes.message}}`);
        }
        setLoading(false);
      })
      .catch(() => {});
  };

  return (
    <PageContainer>
      <div className={sc('container')}>
        <div className={sc('container-title')}>企业基本信息</div>
        <div className={sc('container-desc')} style={{marginTop: 32}}>
          <span>企业名称：</span>
          <span>{detail?.apply?.orgName || '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>统一社会信用代码：</span>
          <span>{detail?.apply?.creditCode || '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>所属地市：</span>
          <span>{detail.apply?.cityName ? (detail.apply.provinceName + '/' + detail.apply.cityName + '/' + detail.apply.countyName) : '--'}</span>
        </div>
      </div>
      <div className={sc('container')}>
        <div className={sc('container-title')}>材料上传</div>
        <div className={sc('container-files')} style={{marginTop: 32}}>
          <span className='label'>企业所属行业：</span>
          <div>
            {detail?.industryFiles &&
              detail?.industryFiles.map((p: any) => {
                return (
                  <>
                    <a target="_blank" rel="noreferrer" style={{ marginRight: 40, color: '#0068ff' }} href={p.path}>
                      {p.fileName}
                    </a>
                  </>
                );
              })}
          </div>
        </div>
        <div className={sc('container-files')} style={{marginTop: 16}}>
          <span className='label'>企业上一年营收或上一年人数证明：</span>
          <div>
            {detail?.incomeFiles &&
              detail?.incomeFiles.map((p: any) => {
                return (
                  <a target="_blank" rel="noreferrer" style={{ marginRight: 40, color: '#0068ff' }} href={p.path}>
                    {p.fileName}
                  </a>
                );
              })}
          </div>
        </div>
      </div>
      {
        (checkState || access['P_AT_FWFA']) &&
          <div style={{ background: '#fff', marginTop: 20, paddingTop: 20, paddingLeft: 100 }}>
            <VerifyStepsDetail list={list} />
            {list && list.length > 0 && state == 0 && (
              <div style={{ display: 'flex', gap: 20, padding: 20 }}>
                <Button
                  loading={loading}
                  type="primary"
                  className={'content-btns-save-btn'}
                  onClick={onSave}
                >
                  提交
                </Button>
                <Button className={'content-btns-back-btn'} onClick={onBack}>
                  返回
                </Button>
              </div>
            )}
          </div>
      }
    </PageContainer>
  );
};
